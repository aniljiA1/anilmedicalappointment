const axios = require("axios");

const blandClient = axios.create({
  baseURL: "https://api.bland.ai/v1",
  headers: {
    authorization: process.env.BLAND_API_KEY,
    "Content-Type": "application/json",
  },
});

/**
 * Webhook URL — localhost pe set mat karo (Bland.ai needs https://)
 */
function getWebhookUrl() {
  const url = process.env.SERVER_URL || "";
  if (url.startsWith("https://")) {
    return `${url}/api/calls/bland-webhook`;
  }
  return null; // localhost pe webhook skip karo
}

/**
 * English call
 */
async function makeAppointmentCall(patientPhone) {
  const webhookUrl = getWebhookUrl();

  const payload = {
    phone_number: patientPhone,
    from: null,
    task: `You are MediCare AI, a friendly healthcare appointment booking assistant.

Follow these steps in order:
1. Greet: "Hello! Welcome to MediCare AI. I am here to help you book a doctor appointment."
2. Ask: "May I know your full name please?"
3. Ask: "Thank you. What symptoms or health problem are you experiencing?"
4. Ask: "When would you like your appointment? For example, tomorrow at 10 AM."
5. Confirm: "Perfect! Your appointment has been booked. The doctor will confirm shortly. Thank you for calling MediCare AI. Have a healthy day!"

Rules:
- Be empathetic and patient
- If you don't understand, politely ask again
- Keep responses short and clear`,
    model: "enhanced",
    language: "en",
    voice: "nat",
    max_duration: 5,
    answered_by_enabled: true,
    wait_for_greeting: true,
    record: true,
    amd: false,
    interruption_threshold: 100,
    temperature: 0.7,
    metadata: { source: "medicare-ai", patientPhone },
  };

  // Sirf production mein webhook add karo
  if (webhookUrl) {
    payload.webhook = webhookUrl;
  }

  const response = await blandClient.post("/calls", payload);
  return response.data;
}

/**
 * Hindi call
 */
async function makeHindiCall(patientPhone) {
  const webhookUrl = getWebhookUrl();

  const payload = {
    phone_number: patientPhone,
    from: null,
    task: `Aap MediCare AI hain, ek friendly healthcare appointment booking assistant. Hindi mein baat karein.

Yeh steps follow karein:
1. "Namaste! MediCare AI mein aapka swagat hai. Main aapki appointment book karne mein madad karunga."
2. "Kripya apna poora naam bataiye?"
3. "Shukriya. Aapko kya takleef hai ya kya symptoms hain?"
4. "Aap kab appointment lena chahte hain? Jaise kal subah 10 baje."
5. "Bilkul! Aapki appointment book ho gayi hai. Doctor jald hi confirm karenge. Shukriya!"`,
    model: "enhanced",
    language: "hi",
    voice: "nat",
    max_duration: 5,
    record: true,
    metadata: { source: "medicare-ai", patientPhone, language: "hi" },
  };

  if (webhookUrl) {
    payload.webhook = webhookUrl;
  }

  const response = await blandClient.post("/calls", payload);
  return response.data;
}

/**
 * Call status
 */
async function getCallStatus(callId) {
  const response = await blandClient.get(`/calls/${callId}`);
  return response.data;
}

/**
 * Call transcript
 */
async function getCallTranscript(callId) {
  const response = await blandClient.get(`/calls/${callId}`);
  return response.data.transcripts || [];
}

/**
 * All calls list
 */
async function listCalls(limit = 20) {
  const response = await blandClient.get("/calls", { params: { limit } });
  return response.data;
}

module.exports = {
  makeAppointmentCall,
  makeHindiCall,
  getCallStatus,
  getCallTranscript,
  listCalls,
};
