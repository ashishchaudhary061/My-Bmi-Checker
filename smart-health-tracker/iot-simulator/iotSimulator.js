// IoT Sensor Data Simulator
// This script simulates real-time health sensor data
// Run with: node iotSimulator.js

const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5000/api/sensor-data';
const SIMULATION_INTERVAL = 5000; // Send data every 5 seconds

// Test user ID (You need to get actual userId from auth)
// For testing, we'll use a dummy ID - replace with actual user ID
const DEMO_USER_ID = 'demo-user-id'; // Replace this with actual user ID

// Simulate realistic health metrics
class HealthMetricsSimulator {
    constructor() {
        // Base values
        this.baseHeartRate = 72;
        this.baseTemperature = 36.8;
        this.baseSpo2 = 98;
        this.dailySteps = 0;

        // Variation ranges
        this.heartRateVariation = 15;
        this.temperatureVariation = 0.5;
        this.stepsPerReading = Math.floor(Math.random() * 20) + 5;
    }

    /**
     * Generate random number within range
     */
    randomInRange(base, variation) {
        return base + (Math.random() - 0.5) * 2 * variation;
    }

    /**
     * Simulate realistic heart rate (varies based on activity)
     */
    getHeartRate() {
        let hr = this.randomInRange(this.baseHeartRate, this.heartRateVariation);

        // Occasionally simulate higher activity
        if (Math.random() < 0.1) {
            hr += Math.random() * 30;
        }

        // Occasionally simulate low heart rate
        if (Math.random() < 0.05) {
            hr -= Math.random() * 20;
        }

        return Math.round(Math.max(50, Math.min(150, hr)));
    }

    /**
     * Simulate body temperature
     */
    getTemperature() {
        let temp = this.randomInRange(this.baseTemperature, this.temperatureVariation);

        // Occasionally simulate fever
        if (Math.random() < 0.05) {
            temp += Math.random() * 2;
        }

        return parseFloat(Math.max(35, Math.min(40, temp)).toFixed(1));
    }

    /**
     * Simulate SpO2 (blood oxygen)
     */
    getSpO2() {
        let spo2 = this.randomInRange(98, 2);

        // Occasionally simulate low oxygen
        if (Math.random() < 0.05) {
            spo2 -= Math.random() * 8;
        }

        return Math.round(Math.max(85, Math.min(100, spo2)));
    }

    /**
     * Simulate step count
     */
    getSteps() {
        this.dailySteps += this.stepsPerReading;
        return this.dailySteps;
    }

    /**
     * Generate complete health data packet
     */
    generateData() {
        return {
            userId: DEMO_USER_ID,
            heartRate: this.getHeartRate(),
            temperature: this.getTemperature(),
            spo2: this.getSpO2(),
            steps: this.getSteps(),
        };
    }
}

// Initialize simulator
const simulator = new HealthMetricsSimulator();

/**
 * Send sensor data to API
 */
async function sendSensorData() {
    try {
        const data = simulator.generateData();

        console.log(`\n📤 Sending sensor data...`);
        console.log(`   ❤️  Heart Rate: ${data.heartRate} BPM`);
        console.log(`   🌡️  Temperature: ${data.temperature}°C`);
        console.log(`   💨 SpO2: ${data.spo2}%`);
        console.log(`   👣 Steps: ${data.steps}`);

        const response = await axios.post(API_URL, data);

        if (response.data.success) {
            console.log(`✅ Data sent successfully!`);

            // Check for alerts
            if (response.data.data.alerts && response.data.data.alerts.length > 0) {
                console.log('\n🚨 ALERTS TRIGGERED:');
                response.data.data.alerts.forEach((alert) => {
                    console.log(`   ⚠️  ${alert.message}`);
                });
            }
        } else {
            console.error('❌ Error:', response.data.message);
        }
    } catch (error) {
        console.error('❌ Failed to send data:', error.message);
        if (error.response) {
            console.error('   Response:', error.response.data);
        }
    }
}

/**
 * Start continuous simulation
 */
function startSimulation() {
    console.log(`
╔═════════════════════════════════════════════╗
║  IoT Health Sensor Simulator                ║
║  Sending data every ${SIMULATION_INTERVAL / 1000} seconds            ║
║  User ID: ${DEMO_USER_ID.padEnd(30)}║
║  API: ${API_URL.padEnd(34)}║
╚═════════════════════════════════════════════╝
    `);

    console.log('⚠️  Remember to replace DEMO_USER_ID with actual user ID!');
    console.log('⏱️  Starting simulation...\n');

    // Send initial data
    sendSensorData();

    // Then send periodically
    setInterval(sendSensorData, SIMULATION_INTERVAL);
}

// Start
startSimulation();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log(
        '\n\n👋 Simulator stopped. Sent day summary:',
        simulator.dailySteps,
        'total steps'
    );
    process.exit(0);
});
