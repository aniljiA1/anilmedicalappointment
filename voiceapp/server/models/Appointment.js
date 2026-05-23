const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true },
    symptoms: { type: String, default: '' },
    appointmentTime: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    callSid: { type: String },
    recordingUrl: { type: String },
    recordingSid: { type: String },
    summary: { type: String },
    language: { type: String, default: 'en' },
    notes: { type: String },
    doctor: { type: String, default: 'Dr. General Physician' },
  },
  { timestamps: true }
);

appointmentSchema.index({ phoneNumber: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
