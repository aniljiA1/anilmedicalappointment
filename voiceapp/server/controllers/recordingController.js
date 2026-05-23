const Appointment = require('../models/Appointment');
const { listRecordings } = require('../services/twilioService');

exports.getAll = async (req, res) => {
  try {
    const appointments = await Appointment.find({ recordingUrl: { $exists: true, $ne: null } })
      .select('patientName phoneNumber recordingUrl recordingSid symptoms createdAt callSid')
      .sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTwilioRecordings = async (req, res) => {
  try {
    const recordings = await listRecordings();
    res.json(recordings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
