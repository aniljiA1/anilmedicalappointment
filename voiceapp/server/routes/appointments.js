const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const auth = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.get('/stats', auth, ctrl.getStats);
router.get('/:id', auth, ctrl.getOne);
router.patch('/:id', auth, ctrl.updateStatus);
router.delete('/:id', auth, ctrl.deleteOne);

module.exports = router;
