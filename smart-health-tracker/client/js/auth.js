// Authentication JavaScript - Handles login and signup
const API_BASE_URL = 'http://localhost:5000/api';

// Toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}

// Show status message
function showMessage(message, type = 'info') {
    const statusDiv = document.getElementById('statusMessage');
    statusDiv.textContent = message;
    statusDiv.className = `status-message show ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

// Handle login
document.getElementById('submitLoginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        showMessage('Logging in...', 'info');

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Save token to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('userName', data.data.name);

            showMessage('Login successful! Redirecting...', 'success');

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Connection error. Please try again.', 'error');
    }
});

// Handle signup
document.getElementById('submitSignupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Validate password strength
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }

    try {
        showMessage('Creating account...', 'info');

        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Save token to localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('userName', data.data.name);

            showMessage('Account created! Redirecting...', 'success');

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showMessage('Connection error. Please try again.', 'error');
    }
});

// On page load, check if already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('authToken');
    if (token) {
        // User is already logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
});
