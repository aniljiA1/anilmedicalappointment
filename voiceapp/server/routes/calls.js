const express = require('express');
const router = express.Router();
const twilioCtr = require('../controllers/callController');
const blandCtr = require('../controllers/blandController');
const auth = require('../middleware/auth');

// ── Bland.ai routes (main routes) ──────────────────────────────
router.post('/initiate', auth, blandCtr.initiateCall);          // Dashboard se call karo
router.post('/bland-webhook', blandCtr.blandWebhook);           // Bland webhook (no auth)
router.get('/status/:callId', auth, blandCtr.getStatus);        // Call status
router.get('/transcript/:callId', auth, blandCtr.getTranscript);// Call transcript
router.get('/list', auth, blandCtr.listAllCalls);               // Saare calls

// ── Twilio fallback routes ──────────────────────────────────────
router.post('/incoming', twilioCtr.incomingCall);
router.post('/collect-name', twilioCtr.collectName);
router.post('/collect-symptoms', twilioCtr.collectSymptoms);
router.post('/collect-time', twilioCtr.collectTime);
router.post('/recording-status', twilioCtr.recordingStatus);
router.post('/status-callback', twilioCtr.statusCallback);

module.exports = router;
