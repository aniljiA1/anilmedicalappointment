const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Generate welcome TwiML
 */
function generateWelcomeTwiML(language = 'en') {
  const response = new VoiceResponse();
  const gather = response.gather({
    input: 'speech',
    action: `${process.env.SERVER_URL}/api/calls/collect-name`,
    method: 'POST',
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
    speechTimeout: 'auto',
    timeout: 8,
  });

  if (language === 'hi') {
    gather.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      'नमस्ते! MediCare AI में आपका स्वागत है। कृपया अपना पूरा नाम बताएं।'
    );
  } else {
    gather.say(
      { voice: 'Polly.Joanna', language: 'en-IN' },
      'Hello! Welcome to MediCare AI appointment system. Please tell me your full name after the beep.'
    );
  }

  response.redirect(`${process.env.SERVER_URL}/api/calls/incoming`);
  return response.toString();
}

/**
 * Generate TwiML to collect symptoms
 */
function generateSymptomsTwiML(patientName, language = 'en') {
  const response = new VoiceResponse();
  const gather = response.gather({
    input: 'speech',
    action: `${process.env.SERVER_URL}/api/calls/collect-symptoms`,
    method: 'POST',
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
    speechTimeout: 'auto',
    timeout: 10,
  });

  if (language === 'hi') {
    gather.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      `धन्यवाद ${patientName}। कृपया अपनी समस्या या लक्षण बताएं।`
    );
  } else {
    gather.say(
      { voice: 'Polly.Joanna', language: 'en-IN' },
      `Thank you ${patientName}. Please describe your symptoms or health concern.`
    );
  }

  return response.toString();
}

/**
 * Generate TwiML to collect appointment time
 */
function generateTimeTwiML(language = 'en') {
  const response = new VoiceResponse();
  const gather = response.gather({
    input: 'speech',
    action: `${process.env.SERVER_URL}/api/calls/collect-time`,
    method: 'POST',
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
    speechTimeout: 'auto',
    timeout: 10,
  });

  if (language === 'hi') {
    gather.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      'आप कब अपॉइंटमेंट लेना चाहते हैं? जैसे कल सुबह दस बजे।'
    );
  } else {
    gather.say(
      { voice: 'Polly.Joanna', language: 'en-IN' },
      'When would you like your appointment? Please say something like, tomorrow morning at 10 AM.'
    );
  }

  return response.toString();
}

/**
 * Generate confirmation + transfer TwiML
 */
function generateTransferTwiML(appointment, language = 'en') {
  const response = new VoiceResponse();
  const doctorNumber = process.env.DOCTOR_PHONE_NUMBER;

  if (language === 'hi') {
    response.say(
      { voice: 'Polly.Aditi', language: 'hi-IN' },
      `आपकी अपॉइंटमेंट बुक हो गई है ${appointment.patientName}। अब आपको डॉक्टर से जोड़ा जा रहा है।`
    );
  } else {
    response.say(
      { voice: 'Polly.Joanna', language: 'en-IN' },
      `Your appointment has been booked successfully, ${appointment.patientName}. Connecting you to the doctor now. Please hold.`
    );
  }

  if (doctorNumber) {
    const dial = response.dial({ record: 'record-from-answer', recordingStatusCallback: `${process.env.SERVER_URL}/api/calls/recording-status` });
    dial.number(doctorNumber);
  } else {
    response.say(
      { voice: 'Polly.Joanna', language: 'en-IN' },
      'The doctor is currently unavailable. We will call you back to confirm your appointment. Thank you.'
    );
  }

  return response.toString();
}

/**
 * Transfer call to doctor
 */
async function transferToDoctor(callSid) {
  const doctorNumber = process.env.DOCTOR_PHONE_NUMBER;
  if (!doctorNumber) throw new Error('Doctor phone number not configured');

  return await client.calls(callSid).update({
    twiml: `<Response><Dial record="record-from-answer"><Number>${doctorNumber}</Number></Dial></Response>`,
  });
}

/**
 * Get recording details
 */
async function getRecording(recordingSid) {
  return await client.recordings(recordingSid).fetch();
}

/**
 * List all recordings
 */
async function listRecordings() {
  return await client.recordings.list({ limit: 50 });
}

module.exports = {
  client,
  generateWelcomeTwiML,
  generateSymptomsTwiML,
  generateTimeTwiML,
  generateTransferTwiML,
  transferToDoctor,
  getRecording,
  listRecordings,
};
