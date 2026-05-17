// Health Data Routes
const express = require('express');
const { receiveSensorData, getHealthData, getLatestData } = require('../controllers/healthDataController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public route for IoT devices to send data
router.post('/sensor-data', receiveSensorData);

// Protected routes - require authentication
router.get('/', authMiddleware, getHealthData);
router.get('/latest', authMiddleware, getLatestData);

module.exports = router;
