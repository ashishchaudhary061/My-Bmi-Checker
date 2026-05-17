# 🚀 Quick Start Guide - Smart Health Tracker

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js installed
- MongoDB running locally (or MongoDB Atlas URL)
- VS Code or any terminal

### Step 1: Install Dependencies (2 min)

```bash
# Backend
cd server
npm install

# IoT Simulator (optional)
cd ../iot-simulator
npm install

# Frontend doesn't need dependencies!
```

### Step 2: Configure Environment (1 min)

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-health-tracker
JWT_SECRET=your_secret_key_here_12345
JWT_EXPIRY=7d
CLIENT_URL=http://localhost:3000
```

### Step 3: Start Everything (2 min)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Output: Server running on port 5000 ✓
```

**Terminal 2 - Frontend:**
```bash
cd client
python -m http.server 3000
# Output: Serving on http://127.0.0.1:3000
```

**Terminal 3 - IoT Simulator (Optional):**
```bash
cd iot-simulator
node iotSimulator.js
```

### Step 4: Access Application

1. **Frontend**: Open browser → http://localhost:3000
2. **Sign Up**: Create account
3. **Dashboard**: View real-time health data
4. **Simulator**: Sends data automatically

---

## 🧪 Testing Without Frontend

### Using Postman

1. **Import Collection**: `Postman_Collection.json`
2. **Test Signup**: Send request to `/api/auth/signup`
3. **Copy Token**: Save from response
4. **Test Data**: Send to `/api/data/sensor-data`

### Using cURL

```bash
# 1. Sign Up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# 2. Copy userId and token from response

# 3. Send Sensor Data
curl -X POST http://localhost:5000/api/data/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID","heartRate":75,"temperature":36.8,"spo2":98,"steps":1200}'

# 4. Get Data (replace TOKEN)
curl -X GET "http://localhost:5000/api/data?hours=24" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Features Overview

### ✅ What's Included

| Feature | Status | Location |
|---------|--------|----------|
| User Authentication | ✅ Complete | `/server/controllers/authController.js` |
| Real-time Dashboard | ✅ Complete | `/client/dashboard.html` |
| Sensor Data API | ✅ Complete | `/server/routes/healthDataRoutes.js` |
| Alert System | ✅ Complete | `/server/controllers/alertController.js` |
| Data Storage | ✅ Complete | MongoDB with indices |
| WebSocket Updates | ✅ Complete | Socket.io enabled |
| Data Export (CSV) | ✅ Complete | Dashboard feature |
| Analytics | ✅ Complete | 24-hour stats |
| Responsive UI | ✅ Complete | Mobile-friendly CSS |

---

## 🔧 Common Issues & Solutions

### Issue: Port 3000 or 5000 already in use

```bash
# Kill process on port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Issue: MongoDB connection error

```bash
# Start MongoDB
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

### Issue: "Cannot find user ID"

1. Sign up in dashboard
2. Open DevTools (F12)
3. Application → Local Storage
4. Copy `userId` value
5. Use in simulator

### Issue: CORS error

Update `server/server.js` line ~13:
```javascript
origin: 'http://localhost:3000'  // Your frontend URL
```

---

## 📈 Test Scenarios

### Scenario 1: Normal Readings

```json
{
  "userId": "your-id",
  "heartRate": 75,
  "temperature": 36.8,
  "spo2": 98,
  "steps": 5000
}
```
Result: ✅ No alerts

### Scenario 2: High Heart Rate

```json
{
  "userId": "your-id",
  "heartRate": 125,
  "temperature": 36.8,
  "spo2": 98,
  "steps": 5000
}
```
Result: ⚠️ Alert triggered - "High heart rate detected"

### Scenario 3: Low Oxygen

```json
{
  "userId": "your-id",
  "heartRate": 75,
  "temperature": 36.8,
  "spo2": 85,
  "steps": 5000
}
```
Result: 🔴 Critical alert - "Low oxygen level detected"

### Scenario 4: High Temperature

```json
{
  "userId": "your-id",
  "heartRate": 75,
  "temperature": 38.5,
  "spo2": 98,
  "steps": 5000
}
```
Result: ⚠️ Alert - "High temperature detected"

---

## 📱 UI Guide

### Authentication Page (`index.html`)
- Sign up form
- Login form
- Toggle between forms
- Status messages

### Dashboard Page (`dashboard.html`)
- **Top Bar**: User name + Logout button
- **Metrics**: 4 real-time cards (Heart, Temp, SpO2, Steps)
- **Statistics**: 24-hour averages
- **Chart**: Heart rate trend (last 24 hours)
- **Alerts**: Recent alerts list
- **Data Table**: All readings with pagination
- **Export**: Download as CSV

---

## 🔑 API Reference (Quick)

### Public Endpoints (No Auth)
```
POST /api/auth/signup
POST /api/auth/login
POST /api/data/sensor-data
```

### Protected Endpoints (Require Token)
```
GET /api/data                 # Get health data
GET /api/data/latest          # Latest reading
GET /api/alerts               # All alerts
GET /api/alerts/active        # Unresolved alerts
GET /api/alerts/stats         # Alert statistics
PUT /api/alerts/{id}/resolve  # Mark alert resolved
```

---

## 💾 Database Collections

### Users
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "hashed_password",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### Health Data
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "heartRate": 75,
  "temperature": 36.8,
  "spo2": 98,
  "steps": 1200,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Alerts
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "type": "heart_rate_high",
  "message": "High heart rate: 125 bpm",
  "severity": "warning",
  "isResolved": false,
  "timestamp": "2024-01-15T09:15:00Z"
}
```

---

## 🎯 Next Steps

### For Learning
1. Understand JWT authentication
2. Explore MongoDB queries
3. Learn Socket.io real-time updates
4. Study Chart.js visualization

### For Production
1. Deploy backend to Heroku/AWS
2. Deploy frontend to Netlify/Vercel
3. Use MongoDB Atlas instead of local
4. Add SSL/HTTPS certificate
5. Setup monitoring and logging
6. Add rate limiting
7. Enable CORS properly

### For Enhancement
1. Add multiple device support
2. Integrate wearable APIs (Fitbit, Apple Health)
3. Add machine learning predictions
4. Create mobile app (React Native)
5. Implement medicine reminders

---

## 📞 Need Help?

1. **Check README.md** for detailed documentation
2. **Test with Postman** before debugging Frontend
3. **Check server logs** for API errors
4. **Open DevTools (F12)** for Frontend errors
5. **Use MongoDB Compass** to inspect database

---

## 🎉 You're Ready!

Your Smart Health Tracker is running. Start by:
1. Creating an account
2. Viewing the dashboard
3. Running the simulator
4. Watching data flow in real-time
5. Triggering alerts

Happy tracking! ❤️

