// Dashboard JavaScript - Main dashboard logic
const API_BASE_URL = 'http://localhost:5000/api';
let heartRateChart = null;
let autoRefreshInterval = null;
let selectedAlertId = null;

// Check authentication on page load
window.addEventListener('load', () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Display user name
    const userName = localStorage.getItem('userName');
    document.getElementById('userNameDisplay').textContent = `Welcome, ${userName}!`;

    // Start dashboard
    initDashboard();
});

// Initialize dashboard
function initDashboard() {
    // Load initial data
    loadHealthData();
    loadAlerts();
    initChart();

    // Setup auto-refresh (every 10 seconds)
    autoRefreshInterval = setInterval(() => {
        loadHealthData();
        loadAlerts();
    }, 10000);

    // Setup event listeners
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('refreshAlertsBtn').addEventListener('click', loadAlerts);
    document.getElementById('filterDataBtn').addEventListener('click', loadHealthData);
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCSV);
    document.getElementById('resolveAlertBtn').addEventListener('click', resolveAlert);
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Get user ID
function getUserId() {
    return localStorage.getItem('userId');
}

// Logout
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = 'index.html';
}

// Load health data and update dashboard
async function loadHealthData() {
    try {
        const hours = document.getElementById('hoursFilter')?.value || 24;
        const response = await fetch(
            `${API_BASE_URL}/data?hours=${hours}&limit=100`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
            }
        );

        const data = await response.json();

        if (data.success) {
            // Update metrics
            updateMetrics(data.data.readings[0]); // Latest reading
            updateStatistics(data.data.stats);
            updateTable(data.data.readings);
            updateChart(data.data.readings);
        }
    } catch (error) {
        console.error('Error loading health data:', error);
    }
}

// Update metric cards with latest data
function updateMetrics(latestReading) {
    if (!latestReading) return;

    // Heart Rate
    document.getElementById('heartRateValue').textContent = latestReading.heartRate;
    const hrStatus = getHeartRateStatus(latestReading.heartRate);
    document.getElementById('heartRateStatus').textContent = hrStatus;

    // Temperature
    document.getElementById('temperatureValue').textContent = latestReading.temperature.toFixed(1);
    const tempStatus = getTempStatus(latestReading.temperature);
    document.getElementById('temperatureStatus').textContent = tempStatus;

    // SpO2
    document.getElementById('spo2Value').textContent = latestReading.spo2;
    const spo2Status = getSpo2Status(latestReading.spo2);
    document.getElementById('spo2Status').textContent = spo2Status;

    // Steps
    document.getElementById('stepsValue').textContent = latestReading.steps;
    document.getElementById('stepsStatus').textContent = 'Today';

    // Add pulse animation if critical
    checkCriticalValues(latestReading);
}

// Helper functions to get status
function getHeartRateStatus(bpm) {
    if (bpm > 120) return '🔴 High';
    if (bpm < 50) return '🔴 Critical';
    if (bpm > 100) return '🟡 Elevated';
    return '🟢 Normal';
}

function getTempStatus(temp) {
    if (temp > 38) return '🔴 High';
    if (temp < 35) return '🟡 Low';
    return '🟢 Normal';
}

function getSpo2Status(spo2) {
    if (spo2 < 90) return '🔴 Critical';
    if (spo2 < 94) return '🟡 Low';
    return '🟢 Normal';
}

// Check for critical values
function checkCriticalValues(reading) {
    const alerts = [];

    if (reading.heartRate > 120 || reading.heartRate < 50) {
        alerts.push(`⚠️ Abnormal heart rate: ${reading.heartRate} BPM`);
    }
    if (reading.spo2 < 90) {
        alerts.push(`⚠️ Low oxygen: ${reading.spo2}%`);
    }
    if (reading.temperature > 38) {
        alerts.push(`⚠️ High temperature: ${reading.temperature}°C`);
    }

    // Display alerts if any
    if (alerts.length > 0) {
        displayTopAlerts(alerts);
    }
}

// Display top alerts
function displayTopAlerts(alerts) {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = alerts
        .map(
            (alert) => `
        <div class="alert-box warning">
            <span>${alert}</span>
            <button class="alert-close" onclick="this.parentElement.remove()">×</button>
        </div>
    `
        )
        .join('');
}

// Update statistics
function updateStatistics(stats) {
    if (!stats || Object.keys(stats).length === 0) {
        document.getElementById('avgHeartRate').textContent = '--';
        document.getElementById('maxHeartRate').textContent = '--';
        document.getElementById('minHeartRate').textContent = '--';
        document.getElementById('avgTemperature').textContent = '--';
        document.getElementById('avgSpo2').textContent = '--';
        document.getElementById('totalSteps').textContent = '--';
        return;
    }

    document.getElementById('avgHeartRate').textContent = (stats.avgHeartRate || 0).toFixed(0);
    document.getElementById('maxHeartRate').textContent = (stats.maxHeartRate || 0).toFixed(0);
    document.getElementById('minHeartRate').textContent = (stats.minHeartRate || 0).toFixed(0);
    document.getElementById('avgTemperature').textContent = (stats.avgTemperature || 0).toFixed(1);
    document.getElementById('avgSpo2').textContent = (stats.avgSpo2 || 0).toFixed(0);
    document.getElementById('totalSteps').textContent = (stats.totalSteps || 0).toFixed(0);
}

// Update data table
function updateTable(readings) {
    const tbody = document.getElementById('tableBody');

    if (readings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = readings
        .map(
            (reading) => `
        <tr>
            <td>${new Date(reading.timestamp).toLocaleString()}</td>
            <td>${reading.heartRate} BPM</td>
            <td>${reading.temperature.toFixed(1)}°C</td>
            <td>${reading.spo2}%</td>
            <td>${reading.steps}</td>
        </tr>
    `
        )
        .join('');
}

// Initialize Chart
function initChart() {
    const ctx = document.getElementById('heartRateChart').getContext('2d');

    heartRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Heart Rate (BPM)',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: '#e74c3c',
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 40,
                    max: 140,
                },
            },
        },
    });
}

// Update Chart
function updateChart(readings) {
    if (!heartRateChart || readings.length === 0) return;

    // Get last 24 readings
    const chartData = readings
        .slice()
        .reverse()
        .slice(0, 24);

    heartRateChart.data.labels = chartData.map((reading) => {
        const time = new Date(reading.timestamp);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });

    heartRateChart.data.datasets[0].data = chartData.map((reading) => reading.heartRate);

    heartRateChart.update();
}

// Load alerts
async function loadAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/alerts`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });

        const data = await response.json();

        if (data.success) {
            displayAlerts(data.data.alerts);
        }
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

// Display alerts
function displayAlerts(alerts) {
    const container = document.getElementById('alertsHistoryContainer');

    if (alerts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No alerts yet</p>';
        return;
    }

    container.innerHTML = alerts
        .map(
            (alert) => `
        <div class="alert-item ${alert.severity}" onclick="viewAlertDetails('${alert._id}', '${alert.type}', '${alert.message}', ${alert.isResolved})">
            <div class="alert-item-content">
                <h3>${getAlertTitle(alert.type)}</h3>
                <p>${alert.message}</p>
                <small>${new Date(alert.timestamp).toLocaleString()}</small>
            </div>
            <span class="alert-badge ${alert.isResolved ? 'resolved' : 'unresolved'}">
                ${alert.isResolved ? 'Resolved' : 'Active'}
            </span>
        </div>
    `
        )
        .join('');
}

// Get alert title based on type
function getAlertTitle(type) {
    const titles = {
        heart_rate_high: '❤️ High Heart Rate',
        heart_rate_low: '❤️ Low Heart Rate',
        spo2_low: '💨 Low Oxygen',
        temperature_high: '🌡️ High Temperature',
        custom: '⚠️ Custom Alert',
    };
    return titles[type] || 'Alert';
}

// View alert details
function viewAlertDetails(alertId, type, message, isResolved) {
    selectedAlertId = alertId;
    const modal = document.getElementById('alertModal');
    const detailsDiv = document.getElementById('alertDetails');

    detailsDiv.innerHTML = `
        <p><strong>Type:</strong> ${getAlertTitle(type)}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Status:</strong> <span class="alert-badge ${isResolved ? 'resolved' : 'unresolved'}">
            ${isResolved ? 'Resolved' : 'Active'}
        </span></p>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Close alert modal
function closeAlertModal() {
    const modal = document.getElementById('alertModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Resolve alert
async function resolveAlert() {
    if (!selectedAlertId) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/alerts/${selectedAlertId}/resolve`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.success) {
            closeAlertModal();
            loadAlerts(); // Refresh alerts
            alert('Alert marked as resolved!');
        }
    } catch (error) {
        console.error('Error resolving alert:', error);
        alert('Failed to resolve alert');
    }
}

// Export data to CSV
function exportToCSV() {
    const table = document.getElementById('dataTable');
    const rows = Array.from(table.querySelectorAll('tr'));

    let csv = [];
    rows.forEach((row) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        const rowData = cells.map((cell) => `"${cell.textContent}"`).join(',');
        csv.push(rowData);
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});
