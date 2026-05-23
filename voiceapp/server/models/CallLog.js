const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema(
  {
    callSid: { type: String, required: true, unique: true },
    from: { type: String },
    to: { type: String },
    status: {
      type: String,
      enum: ['initiated', 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer'],
      default: 'initiated',
    },
    duration: { type: Number, default: 0 },
    direction: { type: String, enum: ['inbound', 'outbound'], default: 'inbound' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    conversationLog: [
      {
        speaker: { type: String, enum: ['ai', 'patient'] },
        text: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    transferredToDoctor: { type: Boolean, default: false },
    doctorNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CallLog', callLogSchema);
