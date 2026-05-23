const Appointment = require('../models/Appointment');
const CallLog = require('../models/CallLog');
const {
  generateWelcomeTwiML,
  generateSymptomsTwiML,
  generateTimeTwiML,
  generateTransferTwiML,
} = require('../services/twilioService');
const { generateSummary, detectLanguage } = require('../services/aiService');
const { emitNewAppointment, emitActiveCall, emitCallEnded } = require('../socket/socketManager');

/**
 * POST /api/calls/incoming
 * Twilio webhook — patient calls in
 */
exports.incomingCall = async (req, res) => {
  const { CallSid, From, To } = req.body;
  try {
    const callLog = await CallLog.create({
      callSid: CallSid,
      from: From,
      to: To,
      status: 'in-progress',
      direction: 'inbound',
    });

    emitActiveCall({ callSid: CallSid, from: From, status: 'in-progress', callLogId: callLog._id });

    const twiml = generateWelcomeTwiML('en');
    res.type('text/xml').send(twiml);
  } catch (err) {
    console.error('incomingCall error:', err);
    res.type('text/xml').send('<Response><Say>Sorry, an error occurred. Please try again.</Say></Response>');
  }
};

/**
 * POST /api/calls/collect-name
 */
exports.collectName = async (req, res) => {
  const { CallSid, SpeechResult, From } = req.body;
  const patientName = SpeechResult?.trim() || 'Unknown';
  const language = detectLanguage(patientName);

  try {
    await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      { $push: { conversationLog: { speaker: 'patient', text: patientName } } }
    );

    // Store name in Twilio session via cookie/query workaround — use DB temp store
    await CallLog.findOneAndUpdate({ callSid: CallSid }, { $set: { 'meta.patientName': patientName, 'meta.from': From, 'meta.language': language } });

    const twiml = generateSymptomsTwiML(patientName, language);
    res.type('text/xml').send(twiml);
  } catch (err) {
    console.error('collectName error:', err);
    res.type('text/xml').send('<Response><Say>Sorry, I could not understand. Please call again.</Say></Response>');
  }
};

/**
 * POST /api/calls/collect-symptoms
 */
exports.collectSymptoms = async (req, res) => {
  const { CallSid, SpeechResult } = req.body;
  const symptoms = SpeechResult?.trim() || 'Not specified';

  try {
    await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      {
        $push: { conversationLog: { speaker: 'patient', text: symptoms } },
        $set: { 'meta.symptoms': symptoms },
      }
    );

    const callLog = await CallLog.findOne({ callSid: CallSid });
    const language = callLog?.meta?.language || 'en';
    const twiml = generateTimeTwiML(language);
    res.type('text/xml').send(twiml);
  } catch (err) {
    console.error('collectSymptoms error:', err);
    res.type('text/xml').send('<Response><Say>An error occurred.</Say></Response>');
  }
};

/**
 * POST /api/calls/collect-time
 */
exports.collectTime = async (req, res) => {
  const { CallSid, SpeechResult } = req.body;
  const appointmentTime = SpeechResult?.trim() || 'To be confirmed';

  try {
    const callLog = await CallLog.findOneAndUpdate(
      { callSid: CallSid },
      {
        $push: { conversationLog: { speaker: 'patient', text: appointmentTime } },
        $set: { 'meta.appointmentTime': appointmentTime },
      },
      { new: true }
    );

    const meta = callLog?.meta || {};
    const appointment = await Appointment.create({
      patientName: meta.patientName || 'Unknown',
      phoneNumber: meta.from || 'Unknown',
      symptoms: meta.symptoms || '',
      appointmentTime,
      callSid: CallSid,
      language: meta.language || 'en',
    });

    appointment.summary = generateSummary(appointment);
    await appointment.save();

    await CallLog.findOneAndUpdate({ callSid: CallSid }, { appointmentId: appointment._id });

    emitNewAppointment(appointment);

    const twiml = generateTransferTwiML(appointment, meta.language || 'en');
    res.type('text/xml').send(twiml);
  } catch (err) {
    console.error('collectTime error:', err);
    res.type('text/xml').send('<Response><Say>An error occurred. Please call again.</Say></Response>');
  }
};

/**
 * POST /api/calls/recording-status
 * Twilio recording status webhook
 */
exports.recordingStatus = async (req, res) => {
  const { CallSid, RecordingUrl, RecordingSid, RecordingStatus } = req.body;
  if (RecordingStatus === 'completed') {
    await Appointment.findOneAndUpdate(
      { callSid: CallSid },
      { recordingUrl: RecordingUrl + '.mp3', recordingSid: RecordingSid }
    );
  }
  res.sendStatus(200);
};

/**
 * POST /api/calls/status-callback
 */
exports.statusCallback = async (req, res) => {
  const { CallSid, CallStatus, CallDuration } = req.body;
  await CallLog.findOneAndUpdate({ callSid: CallSid }, { status: CallStatus, duration: CallDuration || 0 });
  if (['completed', 'failed', 'busy', 'no-answer'].includes(CallStatus)) {
    emitCallEnded(CallSid);
  }
  res.sendStatus(200);
};
