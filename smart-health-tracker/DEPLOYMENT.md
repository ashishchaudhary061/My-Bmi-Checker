# 📋 Deployment Guide - Smart Health Tracker

## 🚀 Deploying to Production

### Option 1: Heroku (Easiest for Backend)

#### Step 1: Install Heroku CLI
```bash
# Download from https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

#### Step 2: Create Heroku App
```bash
cd server
heroku create smart-health-tracker-api
```

#### Step 3: Add MongoDB Atlas
```bash
# Go to https://www.mongodb.com/cloud/atlas
# Create cluster and get connection string
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/smart-health-tracker"
heroku config:set JWT_SECRET="production-secret-key-here"
heroku config:set CLIENT_URL="https://your-frontend-domain.com"
```

#### Step 4: Deploy
```bash
git push heroku main  # or master
```

#### View Logs
```bash
heroku logs --tail
```

---

### Option 2: AWS EC2 (Full Control)

#### Step 1: Create EC2 Instance
```bash
# Ubuntu 20.04 LTS
# Security group: Allow ports 22, 80, 443, 5000
```

#### Step 2: Connect and Setup
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install nodejs -y

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install mongodb-org -y
sudo systemctl start mongod

# Install Nginx
sudo apt install nginx -y
```

#### Step 3: Deploy Application
```bash
# Clone your repository
git clone <repo-url>
cd smart-health-tracker/server

# Install dependencies
npm install

# Create .env file
sudo nano .env

# Start with PM2 (process manager)
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

#### Step 4: Setup Nginx Reverse Proxy
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

Then:
```bash
sudo nginx -t
sudo systemctl restart nginx

# Install SSL
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Option 3: Docker (Containerization)

#### Create Dockerfile (Backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/smart-health-tracker
      JWT_SECRET: your_secret_key
      CLIENT_URL: http://localhost:3000
    depends_on:
      - mongodb

volumes:
  mongo_data:
```

#### Run Docker
```bash
docker-compose up -d
```

---

### Option 4: Netlify/Vercel (Frontend)

#### Step 1: Build
```bash
cd client
# No build needed - it's static HTML/CSS/JS
```

#### Step 2: Deploy to Netlify

1. Drag and drop `client` folder to Netlify
2. Set environment variables
3. Done!

Or via CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=client
```

---

## 🔒 Security Checklist for Production

- [ ] Change `JWT_SECRET` to strong random value
- [ ] Enable HTTPS/SSL certificate
- [ ] Add rate limiting
- [ ] Enable CORS only for your domain
- [ ] Add request input validation
- [ ] Enable MongoDB authentication
- [ ] Use environment variables
- [ ] Add API key authentication
- [ ] Setup logging and monitoring
- [ ] Regular security updates
- [ ] Database backups
- [ ] Firewall rules
- [ ] DDoS protection

---

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
pm2 plus     # Real-time monitoring
pm2 status   # Check status
pm2 logs     # View logs
pm2 delete smart-health-tracker  # Stop
```

### MongoDB Monitoring
```javascript
// server/monitoring.js
db.adminCommand({ dbStats: 1 })
```

### Application Logging
```javascript
// Add Winston logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 📈 Scaling Strategy

### Horizontal Scaling
```bash
# Load balancer distribution
# Server 1 (5000)
# Server 2 (5001)  
# Server 3 (5002)
# → Nginx load balancer (port 80)
```

### Database Scaling
```javascript
// MongoDB Replication
// Primary (queries & updates)
// Secondary (read replicas)
// Arbiter (voting only)
```

### Caching Layer
```bash
# Add Redis for caching
npm install redis
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: |
          cd server
          npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: smart-health-tracker-api
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## 💾 Database Backup Strategy

### Automated Backups
```bash
# Backup MongoDB
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/smart-health-tracker" --out ./backups

# Restore
mongorestore --uri "mongodb+srv://..." ./backups/smart-health-tracker
```

### Scheduled Backups
```bash
# Add to cron
0 2 * * * mongodump --uri "mongodb+srv://..." --out /backups/$(date +%Y%m%d)
```

---

## 📊 Performance Optimization

### Code Optimization
```javascript
// Use connection pooling
const poolSize = 10;

// Add compression
const compression = require('compression');
app.use(compression());

// Optimize queries
db.HealthData.find().lean();  // For read-only queries
```

### Caching Strategy
```javascript
// Cache frequently accessed data
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600 });

app.get('/api/alerts/stats', (req, res) => {
  let stats = myCache.get(req.userId);
  if (!stats) {
    stats = calculateStats();
    myCache.set(req.userId, stats);
  }
  res.json(stats);
});
```

---

## 🚨 Monitoring & Alerts

### Setup Sentry for Error Tracking
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://...@sentry.io/...",
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

### Setup UptimeRobot
1. Visit [uptimerobot.com](https://uptimerobot.com)
2. Add monitor: `https://your-domain.com/health`
3. Get alerts if down

---

## 📱 Mobile App Deployment (React Native)

```bash
npm install -g expo-cli
expo init smart-health-tracker-mobile

# Build APK
expo build:android

# Build iOS
expo build:ios

# Upload to App Store/Google Play
```

---

## 🎯 Deployment Checklist

- [ ] Database configured correctly
- [ ] Environment variables set
- [ ] HTTPS/SSL enabled
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Email notifications configured
- [ ] Monitoring enabled
- [ ] Backups scheduled
- [ ] Domain configured
- [ ] DNS records updated
- [ ] SSL certificate auto-renewal setup
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Security headers added

---

## 🆘 Troubleshooting Deployment

### Issue: Port already in use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Issue: MongoDB connection timeout
```bash
# Check connection string
# Whitelist IP in MongoDB Atlas
# Check network connectivity
```

### Issue: CORS errors
```javascript
// Update CLIENT_URL in .env
CLIENT_URL=https://your-frontend-domain.com
```

### Issue: Memory leak
```bash
# Monitor memory usage
pm2 monit

# Add memory limit
pm2 start server.js -max-memory-restart=500M
```

---

This guide covers the most common deployment scenarios. For specific cloud providers, check their documentation!

