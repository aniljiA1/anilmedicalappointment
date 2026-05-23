const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.get('/me', auth, ctrl.me);

module.exports = router;
