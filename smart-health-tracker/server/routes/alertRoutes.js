// Alert Routes
const express = require('express');
const { getAlerts, getActiveAlerts, resolveAlert, getAlertStats } = require('../controllers/alertController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All alert routes are protected
router.get('/', authMiddleware, getAlerts);
router.get('/active', authMiddleware, getActiveAlerts);
router.get('/stats', authMiddleware, getAlertStats);
router.put('/:alertId/resolve', authMiddleware, resolveAlert);

module.exports = router;
