# 🏥 Smart Health Tracker - Project Overview & File Structure

## 📦 Complete Project Structure

```
smart-health-tracker/
│
├── 📂 server/                          # Backend (Express.js + MongoDB)
│   ├── 📁 config/
│   │   └── database.js                 # MongoDB connection setup
│   │
│   ├── 📁 models/                      # Database schemas
│   │   ├── User.js                     # User model with password hashing
│   │   ├── HealthData.js               # Sensor readings model
│   │   └── Alert.js                    # Health alerts model
│   │
│   ├── 📁 controllers/                 # Business logic
│   │   ├── authController.js           # Sign up & Login logic
│   │   ├── healthDataController.js     # Sensor data handling & alerts
│   │   └── alertController.js          # Alert queries & management
│   │
│   ├── 📁 middleware/
│   │   └── auth.js                     # JWT verification middleware
│   │
│   ├── 📁 routes/                      # API endpoints
│   │   ├── authRoutes.js               # /api/auth/* endpoints
│   │   ├── healthDataRoutes.js         # /api/data/* endpoints
│   │   └── alertRoutes.js              # /api/alerts/* endpoints
│   │
│   ├── server.js                       # Main Express app + Socket.io
│   ├── package.json                    # Dependencies
│   ├── .env                            # Configuration (git ignored)
│   └── .env.example                    # Example environment file
│
├── 📂 client/                          # Frontend (HTML, CSS, JS)
│   ├── 📁 css/
│   │   ├── auth.css                    # Authentication page styles
│   │   └── dashboard.css               # Dashboard styles
│   │
│   ├── 📁 js/
│   │   ├── auth.js                     # Authentication logic
│   │   └── dashboard.js                # Dashboard functionality
│   │
│   ├── index.html                      # Login/Signup page
│   ├── dashboard.html                  # Main dashboard
│   └── package.json                    # Frontend metadata
│
├── 📂 iot-simulator/                   # IoT sensor simulator
│   ├── iotSimulator.js                 # Generates and sends sensor data
│   └── package.json
│
├── 📄 README.md                        # Complete documentation
├── 📄 QUICKSTART.md                    # 5-minute setup guide
├── 📄 DEPLOYMENT.md                    # Production deployment guide
├── 📄 Postman_Collection.json          # API testing collection
├── 📄 PROJECT_OVERVIEW.md              # This file
└── 📄 .gitignore                       # Git ignore rules
```

---

## 🔗 File Dependencies & Flow

```
User Access
    ↓
┌─────────────────────────────────────────────────────┐
│ Frontend (client/)                                  │
├─────────────────────────────────────────────────────┤
│ index.html   ←→  auth.js   (Login/Signup)          │
│ dashboard.html ←→ dashboard.js (Main UI)           │
│ CSS           ← auth.css, dashboard.css             │
└─────────────────────────────────────────────────────┘
                    ↓ (HTTP + WebSocket)
        ┌─────────────────────────────────────────┐
        │  /api/auth/* endpoints                 │
        │  /api/data/* endpoints                 │
        │  /api/alerts/* endpoints               │
        └─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│ Backend (server/)                                   │
├─────────────────────────────────────────────────────┤
│ server.js (Main Express + Socket.io)               │
│     ↓                                               │
│ authRoutes.js ← authController.js ← User.js        │
│ healthRoutes.js ← healthController.js ← HealthData.js
│ alertRoutes.js ← alertController.js ← Alert.js     │
│     ↓ (middleware: auth.js - JWT verification)    │
└─────────────────────────────────────────────────────┘
                    ↓
        ┌─────────────────────────────────────────┐
        │ MongoDB Database                        │
        │ Collections:                            │
        │  • users                                │
        │  • healthdatas                          │
        │  • alerts                               │
        └─────────────────────────────────────────┘

IoT Devices
    ↓
┌─────────────────────────────────────────────────────┐
│ IoT Simulator (iot-simulator/)                      │
├─────────────────────────────────────────────────────┤
│ iotSimulator.js                                     │
│ (Simulates sensor readings)                        │
└─────────────────────────────────────────────────────┘
         ↓ (POST /api/data/sensor-data)
    Backend API → Database
```

---

## 📋 Key Features by File

### Backend Authentication
**Files**: `authController.js`, `auth.js`
- User signup with email validation
- Password hashing with bcryptjs
- JWT token generation
- Login with credentials verification
- Protected route middleware

### Health Data Management
**Files**: `healthDataController.js`, `HealthData.js`
- Receive sensor readings (POST)
- Store with timestamps
- Calculate 24-hour statistics
- Implement alert thresholds
- Return data with pagination

### Alert System
**Files**: `alertController.js`, `Alert.js`
- Generate alerts based on thresholds
- Store alert history
- Track alert resolution
- Provide alert statistics
- Support severity levels

### Frontend Dashboard
**Files**: `dashboard.js`, `dashboard.html`, `dashboard.css`
- Real-time metric display
- Auto-refresh every 10 seconds
- Chart visualization (Chart.js)
- Data export to CSV
- Alert history with resolution
- Responsive mobile design

### Frontend Authentication
**Files**: `auth.js`, `index.html`, `auth.css`
- Login form with validation
- Signup form with password confirmation
- Toggle between forms
- JWT token storage
- Session persistence

### IoT Integration
**Files**: `iotSimulator.js`
- Realistic sensor data generation
- Configurable intervals
- Alert triggering simulation
- Terminal output logging

---

## 🔄 Data Flow Examples

### Example 1: User Registration & Dashboard Display

```
1. User visits http://localhost:3000
2. Clicks "Sign Up"
3. Fills form: name, email, password
4. Submits to POST /api/auth/signup
5. Server: authController.signup()
   - Validates input
   - Hashes password (bcryptjs)
   - Creates User in MongoDB
   - Generates JWT token
6. Response: token + userId
7. Frontend: Stores in localStorage
8. Redirects to dashboard.html
9. dashboard.js runs on load
   - Checks localStorage for token
   - Displays user name
   - Fetches latest health data
   - Renders metrics
10. User sees dashboard with "Waiting for data..." message
```

### Example 2: Sensor Data to Alert

```
1. IoT device/simulator sends:
   POST /api/data/sensor-data
   {
     "userId": "...",
     "heartRate": 135,
     "temperature": 36.8,
     "spo2": 98,
     "steps": 500
   }

2. healthDataController.receiveSensorData()
   - Validates ranges
   - Saves to HealthData collection
   - Calls checkAlerts()

3. checkAlerts() logic:
   - if (heartRate > 120) → Create alert
   - if (spo2 < 90) → Create alert
   - if (temperature > 38) → Create alert

4. Alert saved to Alert collection

5. Response includes alerts array

6. IoT: Can log alerts to console

7. Frontend (dashboard):
   - Auto-fetches alerts every 10 seconds
   - Displays in alerts section
   - User can click to view details
   - User can mark as resolved
```

### Example 3: Protected API Call

```
1. Frontend needs health data
2. Calls: GET /api/data?hours=24
3. Includes: Authorization: Bearer {token}

4. Server receives request
5. Middleware auth.js:
   - Extracts token from header
   - Verifies with JWT_SECRET
   - Extracts userId from token
   - Sets req.userId

6. healthDataController.getHealthData()
   - Uses req.userId (already verified)
   - Queries: HealthData.find({userId: req.userId, ...})
   - Calculates statistics
   - Returns data

7. Frontend receives and displays

If token invalid:
   - auth.js returns 401 Unauthorized
   - Frontend redirects to login
```

---

## 💻 Code Quality Features

### Error Handling
- Try-catch blocks in all async functions
- Comprehensive error messages
- Validation for all inputs
- Database error handling

### Security
- Password hashing (bcryptjs)
- JWT token verification
- CORS configuration
- Input validation
- SQL injection prevention (MongoDB)

### Performance
- Database indices on frequently queried fields
- Pagination support
- Lean queries for read-only operations
- Compression middleware ready

### Scalability
- Modular controller architecture
- Separate concerns (models/controllers/routes)
- Middleware pattern for cross-cutting concerns
- WebSocket support for real-time updates

---

## 🧪 Testing Endpoints

### Using Postman
1. Import `Postman_Collection.json`
2. Set variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (from login response)
3. Test each endpoint

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Send sensor data (no auth)
curl -X POST http://localhost:5000/api/data/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","heartRate":75,"temperature":36.8,"spo2":98,"steps":1200}'
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### HealthData Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  heartRate: Number,
  temperature: Number,
  spo2: Number,
  steps: Number,
  deviceId: String,
  timestamp: Date (indexed)
}
```

### Alerts Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: String (enum),
  message: String,
  severity: String,
  value: Number,
  threshold: Number,
  isResolved: Boolean,
  resolvedAt: Date,
  timestamp: Date (indexed)
}
```

---

## 🚀 Getting Started

### 1️⃣ Quick Start (5 minutes)
See [QUICKSTART.md](./QUICKSTART.md)

### 2️⃣ Full Setup
See [README.md](./README.md)

### 3️⃣ Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md)

### 4️⃣ API Testing
Import [Postman_Collection.json](./Postman_Collection.json)

---

## 📞 Support & Resources

- **Documentation**: README.md (detailed)
- **Quick Setup**: QUICKSTART.md (5 min)
- **Deployment**: DEPLOYMENT.md (production)
- **API**: Postman_Collection.json
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Socket.io Docs**: https://socket.io/docs

---

## ✅ Checklist: What's Included

Backend Features:
- ✅ Express.js server setup with middleware
- ✅ MongoDB connection with models
- ✅ User authentication (JWT + bcrypt)
- ✅ Health data API (sensors)
- ✅ Alert system with thresholds
- ✅ Real-time WebSocket support
- ✅ Request validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Database indices

Frontend Features:
- ✅ Login/Signup pages
- ✅ Dashboard with real-time metrics
- ✅ Chart visualization
- ✅ Alert management
- ✅ Data table with pagination
- ✅ CSV export
- ✅ Responsive design
- ✅ localStorage persistence
- ✅ Error messages
- ✅ Auto-refresh capability

IoT Features:
- ✅ Data simulator
- ✅ Configurable intervals
- ✅ Realistic metrics
- ✅ Alert triggering
- ✅ Terminal logging

Documentation:
- ✅ This overview
- ✅ Complete README
- ✅ Quick start guide
- ✅ Deployment guide
- ✅ Postman collection
- ✅ Inline code comments

---

## 🎯 Production Ready

This project includes everything needed for production:
- Error handling & validation
- Authentication & authorization
- Database optimization (indices)
- Logging ready (can add Winston)
- Monitoring ready (can add Sentry)
- Scalable architecture
- Security best practices
- Documentation complete
- Test collection included

---

**Built with ❤️ for health tracking excellence!**

