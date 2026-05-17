# 🏥 Smart Health Tracker with IoT Integration

A complete web-based smart health monitoring system that collects real-time health data from IoT sensors and displays it on a responsive dashboard with alerts and analytics.

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Guide](#setup-guide)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [IoT Integration](#iot-integration)
- [Usage Examples](#usage-examples)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### ✅ Implemented Features

- **User Authentication**: Secure signup and login with JWT tokens and bcrypt password hashing
- **Real-time Dashboard**: Live health metrics display (Heart Rate, Temperature, SpO2, Steps)
- **IoT Data Integration**: API endpoint to receive sensor data from IoT devices
- **Alert System**: Automatic alerts for abnormal health readings
  - High Heart Rate (>120 BPM)
  - Low Heart Rate (<50 BPM)
  - Low Oxygen (<90% SpO2)
  - High Temperature (>38°C)
- **Analytics**: 24-hour statistics showing averages, max, min values
- **Data Visualization**: Heart rate trend charts using Chart.js
- **Responsive UI**: Beautiful, mobile-friendly design
- **Data Export**: Export health data to CSV format
- **WebSocket Support**: Real-time updates using Socket.io
- **Alert History**: View and manage past alerts
- **Sensor Data Storage**: All readings stored in MongoDB with timestamps

### 🚀 Bonus Features

- Dark mode support (CSS media query ready)
- Alert severity levels (critical, warning, info)
- Alert resolution tracking
- Pagination and filtering in data queries
- Professional error handling
- Production-ready code structure

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Real-time**: Socket.io
- **HTTP Client**: Axios

### Frontend
- **HTML5**
- **CSS3** (with responsive design)
- **Vanilla JavaScript** (ES6+)
- **Chart.js** (for data visualization)

### DevTools
- **Nodemon** (auto-restart on file changes)
- **Environment Variables**: dotenv

### Optional
- **Postman** (API testing)
- **MongoDB Compass** (database visualization)
- **Python** (for serving frontend locally)

---

## 📁 Project Structure

```
smart-health-tracker/
├── server/                      # Backend Express server
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema with password hashing
│   │   ├── HealthData.js       # Sensor data schema
│   │   └── Alert.js            # Alert schema
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── healthDataController.js  # Sensor data handling
│   │   └── alertController.js  # Alert management
│   ├── middleware/
│   │   └── auth.js             # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── healthDataRoutes.js # Data endpoints
│   │   └── alertRoutes.js      # Alert endpoints
│   ├── server.js               # Main Express app with Socket.io
│   ├── package.json
│   └── .env                    # Environment variables
│
├── client/                      # Frontend (HTML, CSS, JS)
│   ├── css/
│   │   ├── auth.css            # Authentication page styles
│   │   └── dashboard.css       # Dashboard styles
│   ├── js/
│   │   ├── auth.js             # Authentication logic
│   │   └── dashboard.js        # Dashboard functionality
│   ├── index.html              # Login/Signup page
│   ├── dashboard.html          # Main dashboard
│   └── package.json
│
├── iot-simulator/              # IoT sensor data simulator
│   ├── iotSimulator.js         # Simulates sensor data
│   └── package.json
│
└── README.md                   # This file
```

---

## 🚀 Setup Guide

### Prerequisites

Make sure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://mongodb.com/try/download/community)
- **npm** (comes with Node.js)

### Step 1: Clone or Download Project

```bash
# If using git
git clone <repository-url>
cd smart-health-tracker

# Or create project folder
mkdir smart-health-tracker
cd smart-health-tracker
```

### Step 2: Setup MongoDB

#### Option A: MongoDB Community (Local)

```bash
# Windows - Start MongoDB service
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string

### Step 3: Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with MongoDB connection
# Edit .env (already created with defaults):
# MONGODB_URI=mongodb://localhost:27017/smart-health-tracker
# JWT_SECRET=your_secret_key_here

# Start server
npm run dev    # Development with auto-reload
# OR
npm start      # Production
```

The server will start at `http://localhost:5000`

### Step 4: Setup Frontend

**Option A: Using Python (Simple)**

```bash
# Navigate to client directory
cd ../client

# Start HTTP server on port 3000
python -m http.server 3000 --bind 127.0.0.1

# Visit http://localhost:3000
```

**Option B: Using Live Server Extension (VS Code)**

1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

**Option C: Manual Local Server**

```bash
# Install http-server globally
npm install -g http-server

# Run in client directory
http-server -p 3000
```

### Step 5: Setup IoT Simulator

```bash
# Navigate to iot-simulator directory
cd ../iot-simulator

# Install dependencies
npm install

# Run simulator
npm start
```

---

## 🎯 Running the Project

### Development Environment

```bash
# Terminal 1: Start MongoDB
# Windows
net start MongoDB
# Linux/Mac
sudo systemctl start mongod

# Terminal 2: Start Backend Server
cd server
npm run dev

# Terminal 3: Start Frontend
cd client
python -m http.server 3000

# Terminal 4: Start IoT Simulator (Optional)
cd iot-simulator
npm start
```

### Production Environment

```bash
# Build/compile if needed (not required for Node.js)

# Start Backend
cd server
NODE_ENV=production npm start

# Start Frontend (using proper static server)
# Use Nginx, Apache, or Node.js server

# Start IoT Simulator
cd iot-simulator
npm start
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. **Sign Up**
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Health Data Endpoints

#### 3. **Send Sensor Data** (Public - No Auth Required)
```http
POST /data/sensor-data
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "heartRate": 78,
  "temperature": 36.5,
  "spo2": 98,
  "steps": 1200
}

Response:
{
  "success": true,
  "message": "Sensor data received successfully",
  "data": {
    "healthData": {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "heartRate": 78,
      "temperature": 36.5,
      "spo2": 98,
      "steps": 1200,
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "alerts": []
  }
}
```

#### 4. **Get Health Data**
```http
GET /data?hours=24&skip=0&limit=100
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "readings": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "userId": "507f1f77bcf86cd799439011",
        "heartRate": 78,
        "temperature": 36.5,
        "spo2": 98,
        "steps": 1200,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 145,
    "stats": {
      "avgHeartRate": 72.5,
      "maxHeartRate": 125,
      "minHeartRate": 45,
      "avgTemperature": 36.7,
      "avgSpo2": 97.8,
      "totalSteps": 8500
    }
  }
}
```

#### 5. **Get Latest Reading**
```http
GET /data/latest
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "heartRate": 78,
    "temperature": 36.5,
    "spo2": 98,
    "steps": 1200,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

### Alert Endpoints

#### 6. **Get All Alerts**
```http
GET /alerts?resolved=false&limit=50&skip=0
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "alerts": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "userId": "507f1f77bcf86cd799439011",
        "type": "heart_rate_high",
        "message": "High heart rate detected: 125 bpm",
        "severity": "warning",
        "value": 125,
        "threshold": 120,
        "isResolved": false,
        "timestamp": "2024-01-15T09:15:00Z"
      }
    ],
    "total": 3
  }
}
```

#### 7. **Get Active Alerts**
```http
GET /alerts/active
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "type": "heart_rate_high",
      "message": "High heart rate detected: 125 bpm",
      "severity": "warning",
      "isResolved": false
    }
  ]
}
```

#### 8. **Resolve Alert**
```http
PUT /alerts/{alertId}/resolve
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Alert resolved",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "isResolved": true,
    "resolvedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### 9. **Get Alert Statistics**
```http
GET /alerts/stats
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "overall": {
      "total": 12,
      "unresolved": 3,
      "critical": 2,
      "warning": 10
    },
    "byType": [
      {
        "_id": "heart_rate_high",
        "count": 5
      },
      {
        "_id": "spo2_low",
        "count": 2
      }
    ]
  }
}
```

---

## 🌐 IoT Integration

### How to Use the IoT Simulator

The IoT simulator (`iot-simulator/iotSimulator.js`) generates realistic health data and sends it to the server.

#### Configuration

Edit `iot-simulator/iotSimulator.js` - Line 9:
```javascript
const DEMO_USER_ID = 'your-actual-user-id-here';
```

Get your actual user ID:
1. Sign up in the dashboard
2. Check browser DevTools → Application → Local Storage
3. Copy the `userId` value
4. Replace in the simulator

#### Running the Simulator

```bash
cd iot-simulator
npm install
npm start
```

The simulator will:
- Generate sensor data every 5 seconds
- Send to API via POST request
- Display data in terminal
- Show alert notifications when thresholds are exceeded

#### Modifying Sensor Values

Edit the following in `iotSimulator.js`:

```javascript
// Change sending interval
const SIMULATION_INTERVAL = 5000; // milliseconds

// Change base healthy values
this.baseHeartRate = 72;        // Normal: 60-100
this.baseTemperature = 36.8;    // Normal: 36-37.5°C
this.baseSpo2 = 98;             // Normal: 95-100%
this.stepsPerReading = 10;      // Steps per 5-second interval

// Change variation ranges
this.heartRateVariation = 15;       // ±15 BPM
this.temperatureVariation = 0.5;    // ±0.5°C
```

### Connecting Real IoT Devices

#### Step 1: Get User Token and ID

```bash
# Sign up/login to get token and userId
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Device",
    "email": "device@example.com",
    "password": "password123"
  }'
```

#### Step 2: Send Data from Device

**Using Python:**
```python
import requests
import json
import time

API_URL = "http://localhost:5000/api/data/sensor-data"
USER_ID = "your-user-id"

data = {
    "userId": USER_ID,
    "heartRate": 75,
    "temperature": 36.8,
    "spo2": 98,
    "steps": 1200
}

response = requests.post(API_URL, json=data)
print(response.json())
```

**Using Arduino/ESP8266:**
```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

void sendData(int hr, float temp, int spo2, int steps) {
  HTTPClient http;
  String url = "http://192.168.x.x:5000/api/data/sensor-data";
  
  StaticJsonDocument<200> doc;
  doc["userId"] = "your-user-id";
  doc["heartRate"] = hr;
  doc["temperature"] = temp;
  doc["spo2"] = spo2;
  doc["steps"] = steps;
  
  String payload;
  serializeJson(doc, payload);
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(payload);
  http.end();
}
```

**Using MQTT (Future Enhancement):**
```javascript
// Can be added to server for MQTT support
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('message', (topic, message) => {
  const data = JSON.parse(message);
  // Save to database
});
```

---

## 💡 Usage Examples

### Example 1: Complete User Flow

```
1. User opens index.html
2. Clicks "Sign up"
3. Fills form and submits
4. Redirected to dashboard.html
5. Dashboard connects to server
6. Waits for sensor data
7. IoT device sends data
8. Dashboard updates in real-time
9. Alert triggers if values abnormal
10. User can view history and export data
```

### Example 2: Postman API Test

1. Open Postman
2. Create new collection "Health Tracker"
3. Add requests (see API Documentation above)
4. Set variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (JWT from login)
5. Test each endpoint

### Example 3: JavaScript Dashboard Integration

```javascript
// Fetch health data
const response = await fetch('http://localhost:5000/api/data?hours=24', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();

// Display in chart
const readings = data.data.readings;
chart.update({
  labels: readings.map(r => r.timestamp),
  data: readings.map(r => r.heartRate)
});
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
```bash
# Check MongoDB is running
# Windows
net start MongoDB

# Linux
sudo systemctl status mongod

# macOS
brew services list

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/smart-health-tracker
```

### Issue: "CORS error in browser console"

**Solution:**
Check `server/server.js` CORS configuration:
```javascript
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Add your frontend URL
    methods: ['GET', 'POST'],
  },
});
```

### Issue: "Frontend doesn't load"

**Solution:**
```bash
# Make sure ports are correct
# Frontend: port 3000
# Backend: port 5000

# Test connectivity
curl http://localhost:5000/health
# Should return: {"success": true, "message": "Server is running"}
```

### Issue: "Token expired errors"

**Solution:**
```javascript
// Update JWT_EXPIRY in .env
JWT_EXPIRY=7d  // Default is 7 days

// Or update token on login/signup
localStorage.setItem('authToken', newToken);
```

### Issue: "Socket.io not connecting"

**Solution:**
1. Check Socket.io URL in dashboard
2. Verify Socket.io is enabled in server
3. Check firewall settings

---

## 🔐 Security Considerations

### Production Checklist

- [ ] Change `JWT_SECRET` in .env to strong random string
- [ ] Enable HTTPS/SSL certificate
- [ ] Add rate limiting to API endpoints
- [ ] Validate all input data
- [ ] Add CAPTCHA to signup
- [ ] Store tokens securely (httpOnly cookies)
- [ ] Add request size limits
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for sensitive data
- [ ] Add logging and monitoring
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Example Security Hardening

```javascript
// server/server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📈 Performance Optimization

### Frontend Optimization
- Minify JavaScript and CSS
- Use CDN for Chart.js
- Implement virtual scrolling for large tables
- Add service worker for offline support

### Backend Optimization
- Add database indexes (already included)
- Implement query pagination
- Cache frequently accessed data
- Use connection pooling for MongoDB

### Database Optimization
```javascript
// Create indexes for faster queries
db.healthdata.createIndex({ "userId": 1, "timestamp": -1 })
db.alerts.createIndex({ "userId": 1, "timestamp": -1 })
```

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Socket.io Documentation](https://socket.io/docs/)
- [Chart.js Guide](https://www.chartjs.org/docs/latest/)

---

## 🚀 Future Enhancements

### Planned Features

1. **Multi-device Support**
   - Support multiple health devices per user
   - Device management dashboard

2. **Advanced Analytics**
   - Weekly/monthly reports
   - Health trends prediction
   - Comparative analysis

3. **Integration**
   - Apple HealthKit integration
   - Google Fit integration
   - Fitbit API integration

4. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode

5. **Machine Learning**
   - Anomaly detection
   - Pattern recognition
   - Health risk assessment

6. **Social Features**
   - Share health achievements
   - Compare with friends (anonymized)
   - Health challenges

7. **Healthcare Integration**
   - Doctor access portal
   - Appointment scheduling
   - Medical records backup

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👥 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 Support

For issues or questions:
- Open an issue in the repository
- Check existing issues first
- Provide detailed error messages
- Include environment details

---

## 🎉 Congratulations!

You now have a fully functional Smart Health Tracker system! 

**Next Steps:**
1. Deploy to cloud (Heroku, AWS, Azure)
2. Connect real IoT devices
3. Customize for specific health requirements
4. Scale the application

Happy tracking! 🏥❤️

