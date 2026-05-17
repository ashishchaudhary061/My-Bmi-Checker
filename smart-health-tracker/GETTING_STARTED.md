# 🏥 Smart Health Tracker - Installation & Usage Summary

## 📦 What You've Received

A complete, production-ready Smart Health Tracker application with:

✅ **Backend**: Express.js + MongoDB + JWT Authentication
✅ **Frontend**: Responsive HTML/CSS/JavaScript Dashboard  
✅ **IoT Integration**: Sensor data simulator + API endpoints
✅ **Real-time Updates**: WebSocket support with Socket.io
✅ **Alerts**: Automatic health threat detection
✅ **Analytics**: 24-hour statistics & trends
✅ **Documentation**: Complete setup guides + API docs

---

## ⚡ 5-Step Quick Start

### Step 1: Install Dependencies
```bash
cd server && npm install
cd ../iot-simulator && npm install
```

### Step 2: Start MongoDB
```bash
net start MongoDB          # Windows
# OR
sudo systemctl start mongod # Linux
# OR
brew services start mongodb-community  # macOS
```

### Step 3: Start Backend
```bash
cd server
npm run dev    # Starts on port 5000
```

### Step 4: Start Frontend
```bash
cd client
python -m http.server 3000   # Visit: http://localhost:3000
```

### Step 5: Try It Out
1. Sign up at http://localhost:3000
2. See dashboard (waiting for data)
3. Run simulator in another terminal:
   ```bash
   cd iot-simulator
   node iotSimulator.js
   ```
4. Watch data appear in real-time!

---

## 📂 Project Structure

```
smart-health-tracker/
├── server/              # Backend (Express + MongoDB)
├── client/              # Frontend (HTML/CSS/JS)
├── iot-simulator/       # Sensor data generator
├── README.md            # Full documentation (START HERE!)
├── QUICKSTART.md        # 5-minute setup
├── DEPLOYMENT.md        # Production deployment
└── Postman_Collection.json  # API testing
```

---

## 🔑 Key Files Explained

### Backend Core
- `server/server.js` - Main Express app with Socket.io
- `server/models/` - Database schemas (User, HealthData, Alert)
- `server/controllers/` - Business logic
- `server/routes/` - API endpoints
- `server/.env` - Configuration (create from .env.example)

### Frontend Core
- `client/index.html` - Login/Signup page
- `client/dashboard.html` - Main dashboard
- `client/js/auth.js` - Authentication logic
- `client/js/dashboard.js` - Dashboard functionality

### IoT
- `iot-simulator/iotSimulator.js` - Generates sensor data

---

## 📈 Feature Overview

| Feature | Location | Status |
|---------|----------|--------|
| User Authentication | `server/controllers/authController.js` | ✅ Complete |
| Real-time Dashboard | `client/dashboard.html` + `dashboard.js` | ✅ Complete |
| Sensor Data API | `server/routes/healthDataRoutes.js` | ✅ Complete |
| Alert System | `server/controllers/alertController.js` | ✅ Complete |
| Data Analytics | `client/js/dashboard.js` | ✅ Complete |
| WebSocket Updates | `server/server.js` | ✅ Complete |
| Export to CSV | `client/js/dashboard.js` | ✅ Complete |
| Responsive UI | `client/css/` | ✅ Complete |

---

## 🚀 Common Tasks

### Run Entire System
**Terminal 1:**
```bash
# Ensure MongoDB is running
net start MongoDB

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: Frontend  
cd client && python -m http.server 3000

# Terminal 4: Simulator (Optional)
cd iot-simulator && node iotSimulator.js
```

### Test API with Postman
1. Import: `Postman_Collection.json`
2. Test endpoints in collection
3. Use responses to populate variables

### Send Data Manually
```bash
curl -X POST http://localhost:5000/api/data/sensor-data \
  -H "Content-Type: application/json" \
  -d '{"userId":"YOUR_USER_ID","heartRate":75,"temperature":36.8,"spo2":98,"steps":5000}'
```

### Debug Issues
1. Check server logs: `npm run dev` output
2. Check browser console: F12
3. Check MongoDB: `mongo` → `db.users.find()`
4. Check connectivity: `curl http://localhost:5000/health`

---

## 📊 API Reference (Quick)

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

### Health Data
- `POST /api/data/sensor-data` - Send sensor reading (no auth)
- `GET /api/data` - Get readings (requires token)
- `GET /api/data/latest` - Latest reading

### Alerts
- `GET /api/alerts` - All alerts
- `GET /api/alerts/active` - Active alerts
- `PUT /api/alerts/{id}/resolve` - Mark resolved
- `GET /api/alerts/stats` - Alert statistics

---

## 🔒 Security Notes

### For Development
- JWT_SECRET in .env is insecure (change it!)
- MongoDB running locally
- CORS allows localhost:3000

### For Production
1. Change `JWT_SECRET` to strong random value
2. Enable HTTPS/SSL certificate
3. Use MongoDB Atlas instead of local
4. Add rate limiting
5. Enable CORS for your domain only
6. Add input validation
7. Setup monitoring

See **DEPLOYMENT.md** for full security checklist.

---

## 🧪 Test Scenarios

### Scenario 1: Normal Health
```json
{"userId":"id","heartRate":72,"temperature":36.8,"spo2":98,"steps":5000}
```
✅ No alerts

### Scenario 2: High Heart Rate
```json
{"userId":"id","heartRate":135,"temperature":36.8,"spo2":98,"steps":5000}
```
🚨 Alert triggered

### Scenario 3: Low Oxygen
```json
{"userId":"id","heartRate":72,"temperature":36.8,"spo2":85,"steps":5000}
```
🔴 Critical alert

### Scenario 4: Fever
```json
{"userId":"id","heartRate":72,"temperature":38.5,"spo2":98,"steps":5000}
```
⚠️ Alert triggered

---

## 📚 Documentation Files

| File | Purpose | Time |
|------|---------|------|
| QUICKSTART.md | 5-minute setup | 5 min |
| README.md | Complete guide | 20 min |
| DEPLOYMENT.md | Production guide | 15 min |
| PROJECT_OVERVIEW.md | File structure | 10 min |
| Postman_Collection.json | API testing | N/A |

**Start with QUICKSTART.md for fastest setup!**

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] MongoDB running: `mongo --version`
- [ ] Node installed: `node --version`
- [ ] Backend starts: `npm run dev` (no errors)
- [ ] Frontend loads: http://localhost:3000 (page visible)
- [ ] Can sign up: Form submits successfully
- [ ] Can login: Redirects to dashboard
- [ ] Can send data: Simulator runs without errors
- [ ] Data appears: Dashboard shows metrics
- [ ] Alerts work: Send high HR, see alert
- [ ] API responds: `curl http://localhost:5000/health`

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Start MongoDB
net start MongoDB              # Windows
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # macOS
```

### "Port 3000 already in use"
```bash
# Use different port
python -m http.server 3001
```

### "CORS error"
```bash
# Check CLIENT_URL in server/.env
CLIENT_URL=http://localhost:3000
```

### "404 on /api/auth/signup"
```bash
# Backend not running? Check port 5000
curl http://localhost:5000/health
```

---

## 🎯 Next Steps

### Learn the Code
1. Read `server/server.js` - Entry point
2. Read `server/models/` - Data structures
3. Read `server/controllers/` - Business logic
4. Read `client/dashboard.js` - Frontend logic

### Extend Features
1. Add email notifications
2. Connect real IoT device (Arduino/ESP8266)
3. Add machine learning predictions
4. Create mobile app (React Native)
5. Add social sharing features

### Deploy
1. See **DEPLOYMENT.md** for:
   - Heroku deployment
   - AWS EC2 setup
   - Docker containerization
   - Netlify frontend deployment

### Scale
1. Add Redis caching
2. Setup load balancing
3. Implement database sharding
4. Add CDN for frontend

---

## 💡 Pro Tips

1. **Use Postman** for API testing before debugging frontend
2. **Check server logs** in terminal - most issues visible there
3. **Use MongoDB Compass** to inspect database visually
4. **Enable auto-refresh** on dashboard (every 10 seconds)
5. **Export data** regularly as CSV backup

---

## 📞 Support Resources

- **Official Docs**: Check README.md first
- **Stack Overflow**: Tag: node.js, express, mongodb
- **GitHub Issues**: Check if issue already reported
- **Community**: Node.js forums, MongoDB community

---

## 🎉 You're All Set!

Your Smart Health Tracker is ready to use. Start with:

1. Open QUICKSTART.md
2. Follow the 5 steps
3. Access http://localhost:3000
4. Sign up and explore!

**Happy tracking! ❤️🏥**

---

*Built with Express.js, MongoDB, and real-time WebSocket magic ✨*

