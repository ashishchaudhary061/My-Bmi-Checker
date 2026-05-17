// Main Server File - Express App Setup with Socket.io
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const healthDataRoutes = require('./routes/healthDataRoutes');
const alertRoutes = require('./routes/alertRoutes');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io for real-time updates
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/data', healthDataRoutes);
app.use('/api/alerts', alertRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Socket.io Connection - For real-time health data updates
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  // Listen for new sensor data and broadcast to user
  socket.on('new-data', (data) => {
    const { userId } = data;
    io.to(`user_${userId}`).emit('health-update', data);
  });

  // Emit alert to user
  socket.on('new-alert', (data) => {
    const { userId } = data;
    io.to(`user_${userId}`).emit('alert-triggered', data);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║  Smart Health Tracker Server Running          ║
║  Port: ${PORT}                                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}                 ║
║  WebSocket: Enabled                            ║
╚═══════════════════════════════════════════════╝
  `);
});

module.exports = { app, server, io };
