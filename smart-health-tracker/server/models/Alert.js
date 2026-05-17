// Alert Model - Stores health alerts triggered by abnormal readings
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['heart_rate_high', 'heart_rate_low', 'spo2_low', 'temperature_high', 'custom'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  severity: {
    type: String,
    enum: ['critical', 'warning', 'info'],
    default: 'warning',
  },
  value: {
    type: Number, // The actual reading that triggered the alert
  },
  threshold: {
    type: Number, // The threshold that was exceeded
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Index for efficient queries
alertSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Alert', alertSchema);
