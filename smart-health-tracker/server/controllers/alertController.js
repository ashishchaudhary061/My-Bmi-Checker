// Alert Controller - Handles alert queries and management
const Alert = require('../models/Alert');

// @route   GET /api/alerts
// @desc    Get user's alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const userId = req.userId;
    const resolved = req.query.resolved; // Filter by resolved status
    const limit = req.query.limit || 50;
    const skip = req.query.skip || 0;

    // Build query
    let query = { userId };
    if (resolved !== undefined) {
      query.isResolved = resolved === 'true';
    }

    // Get alerts
    const alerts = await Alert.find(query)
      .sort({ timestamp: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    // Get count
    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        alerts,
        total,
      },
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ success: false, message: 'Error fetching alerts' });
  }
};

// @route   GET /api/alerts/active
// @desc    Get unresolved alerts
// @access  Private
exports.getActiveAlerts = async (req, res) => {
  try {
    const userId = req.userId;

    const alerts = await Alert.find({
      userId,
      isResolved: false,
    }).sort({ severity: -1, timestamp: -1 });

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ success: false, message: 'Error fetching active alerts' });
  }
};

// @route   PUT /api/alerts/:alertId/resolve
// @desc    Mark alert as resolved
// @access  Private
exports.resolveAlert = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.userId;

    // Find and update alert
    const alert = await Alert.findOneAndUpdate(
      { _id: alertId, userId },
      { isResolved: true, resolvedAt: new Date() },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Alert resolved',
      data: alert,
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    res.status(500).json({ success: false, message: 'Error resolving alert' });
  }
};

// @route   GET /api/alerts/stats
// @desc    Get alert statistics
// @access  Private
exports.getAlertStats = async (req, res) => {
  try {
    const userId = req.userId;

    const stats = await Alert.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unresolved: {
            $sum: { $cond: [{ $eq: ['$isResolved', false] }, 1, 0] },
          },
          critical: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] },
          },
          warning: {
            $sum: { $cond: [{ $eq: ['$severity', 'warning'] }, 1, 0] },
          },
        },
      },
    ]);

    // Count by type
    const byType = await Alert.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        byType,
      },
    });
  } catch (error) {
    console.error('Error fetching alert stats:', error);
    res.status(500).json({ success: false, message: 'Error fetching alert stats' });
  }
};
