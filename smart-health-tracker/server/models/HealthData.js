// HealthData Model - Stores real-time health metrics from IoT sensors
const mongoose = require('mongoose');

const healthDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
    min: 0,
    max: 250, // Reasonable upper limit for heart rate
  },
  temperature: {
    type: Number,
    required: true,
    min: 32, // Celsius
    max: 44,
  },
  spo2: {
    type: Number,
    required: true,
    min: 0,
    max: 100, // SpO2 is percentage
  },
  steps: {
    type: Number,
    required: true,
    min: 0,
  },
  deviceId: {
    type: String,
    default: 'default-device', // For multi-device support later
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true, // Index for faster queries on time ranges
  },
});

// Index for efficient time-based queries
healthDataSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('HealthData', healthDataSchema);
