const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/recordingController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.get('/twilio', auth, ctrl.getTwilioRecordings);

module.exports = router;
