// Health Data Controller - Handles sensor data and health metrics
const HealthData = require('../models/HealthData');
const Alert = require('../models/Alert');

// Alert thresholds
const THRESHOLDS = {
  heartRateHigh: 120,
  heartRateLow: 50,
  spo2Low: 90,
  temperatureHigh: 38,
};

/**
 * Check if reading triggers an alert
 * @param {Object} data - Health data reading
 * @returns {Array} - Array of alerts triggered
 */
const checkAlerts = async (userId, data) => {
  const alerts = [];

  if (data.heartRate > THRESHOLDS.heartRateHigh) {
    alerts.push({
      type: 'heart_rate_high',
      message: `High heart rate detected: ${data.heartRate} bpm`,
      severity: 'warning',
      value: data.heartRate,
      threshold: THRESHOLDS.heartRateHigh,
    });
  }

  if (data.heartRate < THRESHOLDS.heartRateLow) {
    alerts.push({
      type: 'heart_rate_low',
      message: `Low heart rate detected: ${data.heartRate} bpm`,
      severity: 'critical',
      value: data.heartRate,
      threshold: THRESHOLDS.heartRateLow,
    });
  }

  if (data.spo2 < THRESHOLDS.spo2Low) {
    alerts.push({
      type: 'spo2_low',
      message: `Low oxygen level detected: ${data.spo2}%`,
      severity: 'critical',
      value: data.spo2,
      threshold: THRESHOLDS.spo2Low,
    });
  }

  if (data.temperature > THRESHOLDS.temperatureHigh) {
    alerts.push({
      type: 'temperature_high',
      message: `High temperature detected: ${data.temperature}°C`,
      severity: 'warning',
      value: data.temperature,
      threshold: THRESHOLDS.temperatureHigh,
    });
  }

  // Save alerts to database
  if (alerts.length > 0) {
    const savedAlerts = await Alert.insertMany(
      alerts.map(alert => ({ ...alert, userId }))
    );
    return savedAlerts;
  }

  return [];
};

// @route   POST /api/sensor-data
// @desc    Receive sensor data from IoT device
// @access  Public (or add token verification for production)
exports.receiveSensorData = async (req, res) => {
  try {
    const { userId, heartRate, temperature, spo2, steps } = req.body;

    // Validation
    if (!userId || heartRate === undefined || temperature === undefined || spo2 === undefined || steps === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: userId, heartRate, temperature, spo2, steps',
      });
    }

    // Validate ranges
    if (heartRate < 0 || heartRate > 250) {
      return res.status(400).json({ success: false, message: 'Invalid heart rate' });
    }
    if (temperature < 32 || temperature > 44) {
      return res.status(400).json({ success: false, message: 'Invalid temperature' });
    }
    if (spo2 < 0 || spo2 > 100) {
      return res.status(400).json({ success: false, message: 'Invalid SpO2 value' });
    }
    if (steps < 0) {
      return res.status(400).json({ success: false, message: 'Invalid steps count' });
    }

    // Save health data
    const healthData = await HealthData.create({
      userId,
      heartRate,
      temperature,
      spo2,
      steps,
    });

    // Check for alerts
    const triggeredAlerts = await checkAlerts(userId, {
      heartRate,
      temperature,
      spo2,
      steps,
    });

    res.status(201).json({
      success: true,
      message: 'Sensor data received successfully',
      data: {
        healthData,
        alerts: triggeredAlerts,
      },
    });
  } catch (error) {
    console.error('Error receiving sensor data:', error);
    res.status(500).json({ success: false, message: 'Error saving sensor data' });
  }
};

// @route   GET /api/data
// @desc    Get user's health data (last 24 hours by default)
// @access  Private
exports.getHealthData = async (req, res) => {
  try {
    const userId = req.userId;
    const hours = req.query.hours || 24;
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 100;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000);

    // Get data
    const data = await HealthData.find({
      userId,
      timestamp: { $gte: startDate, $lte: endDate },
    })
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Get count
    const total = await HealthData.countDocuments({
      userId,
      timestamp: { $gte: startDate, $lte: endDate },
    });

    // Calculate statistics
    const stats = await HealthData.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: '$heartRate' },
          maxHeartRate: { $max: '$heartRate' },
          minHeartRate: { $min: '$heartRate' },
          avgTemperature: { $avg: '$temperature' },
          avgSpo2: { $avg: '$spo2' },
          totalSteps: { $sum: '$steps' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        readings: data,
        total,
        stats: stats[0] || {}, // Default to empty if no data
      },
    });
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ success: false, message: 'Error fetching health data' });
  }
};

// @route   GET /api/data/latest
// @desc    Get latest health reading
// @access  Private
exports.getLatestData = async (req, res) => {
  try {
    const userId = req.userId;

    const latestData = await HealthData.findOne({ userId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: latestData || {},
    });
  } catch (error) {
    console.error('Error fetching latest data:', error);
    res.status(500).json({ success: false, message: 'Error fetching latest data' });
  }
};
