/**
 * Generate AI-based appointment summary
 * Uses a simple rule-based approach; swap with OpenAI/Anthropic for production
 */
function generateSummary(appointment) {
  const { patientName, symptoms, appointmentTime, phoneNumber } = appointment;

  const urgencyKeywords = ['severe', 'unbearable', 'emergency', 'accident', 'chest pain', 'breathing'];
  const isUrgent = urgencyKeywords.some((kw) => symptoms?.toLowerCase().includes(kw));

  return `
Patient ${patientName} (${phoneNumber}) has booked an appointment for ${appointmentTime || 'a time to be confirmed'}.
Chief complaint: ${symptoms || 'Not specified'}.
Priority: ${isUrgent ? '🔴 HIGH - Requires immediate attention' : '🟡 ROUTINE - Standard consultation'}.
  `.trim();
}

/**
 * Detect language from speech (basic heuristic)
 */
function detectLanguage(text) {
  if (!text) return 'en';
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
}

module.exports = { generateSummary, detectLanguage };
