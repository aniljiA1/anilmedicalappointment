const Appointment = require("../models/Appointment");
const CallLog = require("../models/CallLog");
const {
  makeAppointmentCall,
  makeHindiCall,
  getCallStatus,
  getCallTranscript,
  listCalls,
} = require("../services/blandService");
const { generateSummary } = require("../services/aiService");
const {
  emitNewAppointment,
  emitActiveCall,
  emitCallEnded,
  emitCallUpdate,
} = require("../socket/socketManager");

/**
 * POST /api/calls/initiate
 */
exports.initiateCall = async (req, res) => {
  try {
    const { phoneNumber, language = "en" } = req.body;

    if (!phoneNumber)
      return res.status(400).json({ error: "Phone number required" });
    if (!process.env.BLAND_API_KEY)
      return res.status(500).json({ error: "BLAND_API_KEY not set in .env" });

    const blandResponse =
      language === "hi"
        ? await makeHindiCall(phoneNumber)
        : await makeAppointmentCall(phoneNumber);

    const callId = blandResponse.call_id;

    await CallLog.create({
      callSid: callId,
      from: phoneNumber,
      to: "bland-ai",
      status: "initiated",
      direction: "outbound",
    });

    emitActiveCall({ callSid: callId, from: phoneNumber, status: "initiated" });

    // Localhost: poll karo call complete hone ke baad
    const isLocalhost = !process.env.SERVER_URL?.startsWith("https://");
    if (isLocalhost) {
      setTimeout(() => pollCallResult(callId, phoneNumber, language), 60000);
    }

    res.json({
      success: true,
      callId,
      message: `✅ Call started! Bland.ai is calling ${phoneNumber}`,
    });
  } catch (err) {
    console.error("initiateCall error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.message || err.message });
  }
};

/**
 * Polling for localhost (webhook nahi hai to)
 */
async function pollCallResult(callId, phoneNumber, language, attempts = 0) {
  if (attempts > 12) return;

  try {
    const callData = await getCallStatus(callId);
    const status = callData.status;

    emitCallUpdate({ callSid: callId, status });

    if (status === "completed") {
      console.log(`📞 Call ${callId} completed, extracting info...`);

      const transcripts =
        callData.transcripts || callData.concatenated_transcript || [];
      const extracted = extractFromTranscript(transcripts);

      console.log("🔍 Extracted:", extracted);

      const appointment = await Appointment.create({
        patientName: extracted.patientName || "Unknown Patient",
        phoneNumber: phoneNumber,
        symptoms: extracted.symptoms || "Not specified",
        appointmentTime: extracted.appointmentTime || "To be confirmed",
        callSid: callId,
        recordingUrl: callData.recording_url || "",
        language: language,
      });

      appointment.summary = generateSummary(appointment);
      await appointment.save();

      await CallLog.findOneAndUpdate(
        { callSid: callId },
        {
          status: "completed",
          duration: callData.call_length || 0,
          appointmentId: appointment._id,
        },
      );

      emitNewAppointment(appointment);
      emitCallEnded(callId);
      console.log(`✅ Appointment saved for: ${appointment.patientName}`);
    } else if (["failed", "busy", "no-answer", "canceled"].includes(status)) {
      await CallLog.findOneAndUpdate({ callSid: callId }, { status });
      emitCallEnded(callId);
    } else {
      // Call abhi chal rahi hai — 30s baad dobara check
      setTimeout(
        () => pollCallResult(callId, phoneNumber, language, attempts + 1),
        30000,
      );
    }
  } catch (err) {
    console.error("pollCallResult error:", err.message);
    setTimeout(
      () => pollCallResult(callId, phoneNumber, language, attempts + 1),
      30000,
    );
  }
}

/**
 * POST /api/calls/bland-webhook  (production/ngrok)
 */
exports.blandWebhook = async (req, res) => {
  try {
    const {
      call_id,
      status,
      to,
      duration,
      recording_url,
      transcripts,
      metadata,
    } = req.body;
    console.log("📞 Bland webhook:", { call_id, status });

    if (status === "completed" && transcripts?.length > 0) {
      const extracted = extractFromTranscript(transcripts);

      const appointment = await Appointment.create({
        patientName: extracted.patientName || "Unknown Patient",
        phoneNumber: to || metadata?.patientPhone || "Unknown",
        symptoms: extracted.symptoms || "Not specified",
        appointmentTime: extracted.appointmentTime || "To be confirmed",
        callSid: call_id,
        recordingUrl: recording_url || "",
        language: metadata?.language || "en",
      });

      appointment.summary = generateSummary(appointment);
      await appointment.save();

      await CallLog.findOneAndUpdate(
        { callSid: call_id },
        {
          status: "completed",
          duration: duration || 0,
          appointmentId: appointment._id,
        },
      );

      emitNewAppointment(appointment);
      emitCallEnded(call_id);
    }

    emitCallUpdate({ callSid: call_id, status, duration });
    res.sendStatus(200);
  } catch (err) {
    console.error("blandWebhook error:", err);
    res.sendStatus(200);
  }
};

exports.getStatus = async (req, res) => {
  try {
    res.json(await getCallStatus(req.params.callId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.getTranscript = async (req, res) => {
  try {
    res.json(await getCallTranscript(req.params.callId));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.listAllCalls = async (req, res) => {
  try {
    res.json(await listCalls(req.query.limit || 20));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// ─── Smart Transcript Extractor ──────────────────────────────────────────────

function extractFromTranscript(transcripts) {
  if (!transcripts || transcripts.length === 0) {
    return { patientName: "", symptoms: "", appointmentTime: "" };
  }

  // transcripts array of objects: { user: 'assistant'|'user', text: '...' }
  const pairs = [];
  let lastAI = "";

  for (const t of transcripts) {
    const text = (t.text || t.content || "").trim();
    const role = t.user || t.role || "";

    if (role === "assistant" || role === "ai") {
      lastAI = text.toLowerCase();
    } else if (role === "user" || role === "human") {
      pairs.push({ aiQuestion: lastAI, patientAnswer: text });
    }
  }

  console.log("📝 Conversation pairs:", pairs.length);

  let patientName = "";
  let symptoms = "";
  let appointmentTime = "";

  // Name keywords
  const nameKeywords = [
    "name",
    "naam",
    "aapka naam",
    "your name",
    "full name",
    "may i know",
  ];
  // Symptom keywords
  const symptomKeywords = [
    "symptom",
    "problem",
    "takleef",
    "bimari",
    "health",
    "issue",
    "concern",
    "experiencing",
    "feeling",
  ];
  // Time keywords
  const timeKeywords = [
    "appointment",
    "time",
    "when",
    "kab",
    "date",
    "schedule",
    "prefer",
    "available",
  ];

  for (const pair of pairs) {
    const q = pair.aiQuestion;
    const a = pair.patientAnswer;

    if (!patientName && nameKeywords.some((k) => q.includes(k))) {
      // Name answer — clean karo
      patientName = cleanName(a);
    } else if (!symptoms && symptomKeywords.some((k) => q.includes(k))) {
      symptoms = a;
    } else if (!appointmentTime && timeKeywords.some((k) => q.includes(k))) {
      appointmentTime = a;
    }
  }

  // Fallback: agar keywords match nahi hue to position se lo
  const patientAnswers = pairs.map((p) => p.patientAnswer);
  if (!patientName && patientAnswers[0])
    patientName = cleanName(patientAnswers[0]);
  if (!symptoms && patientAnswers[1]) symptoms = patientAnswers[1];
  if (!appointmentTime && patientAnswers[2])
    appointmentTime = patientAnswers[2];

  return { patientName, symptoms, appointmentTime };
}

/**
 * Name ko clean karo — zyada lamba text name nahi ho sakta
 */
function cleanName(text) {
  if (!text) return "";
  // Agar 5 se zyada words hain to ye name nahi hai
  const words = text.trim().split(/\s+/);
  if (words.length > 5) return "Unknown Patient";
  // Numbers aur special chars remove karo
  const cleaned = text.replace(/[^a-zA-Z\u0900-\u097F\s]/g, "").trim();
  return cleaned || "Unknown Patient";
}
