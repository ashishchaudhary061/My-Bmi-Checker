// Load saved data or initialize
let steps = localStorage.getItem("steps") ? Number(localStorage.getItem("steps")) : 0;
let water = localStorage.getItem("water") ? Number(localStorage.getItem("water")) : 0;
let exercise = localStorage.getItem("exercise") ? Number(localStorage.getItem("exercise")) : 0;

// Elements
const stepCount = document.getElementById("stepCount");
const waterCount = document.getElementById("waterCount");
const exerciseCount = document.getElementById("exerciseCount");

const stepInput = document.getElementById("stepInput");
const waterInput = document.getElementById("waterInput");
const exerciseInput = document.getElementById("exerciseInput");

const addBtn = document.getElementById("addBtn");
const notifyBtn = document.getElementById("notifyBtn");

// Update UI
function updateUI() {
    stepCount.textContent = steps;
    waterCount.textContent = water;
    exerciseCount.textContent = exercise;

    chart.data.datasets[0].data = [steps, water, exercise];
    chart.update();
}

// Save to localStorage
function saveData() {
    localStorage.setItem("steps", steps);
    localStorage.setItem("water", water);
    localStorage.setItem("exercise", exercise);
}

// Chart setup
const ctx = document.getElementById("progressChart").getContext("2d");

const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
        labels: ["Steps", "Water", "Exercise"],
        datasets: [{
            data: [steps, water, exercise],
            backgroundColor: ["#00e6ff", "#4caf50", "#ff9800"],
            borderWidth: 1
        }]
    },
    options: {
        plugins: {
            legend: {
                labels: {
                    color: "#fff"
                }
            }
        }
    }
});

// Add activity
addBtn.addEventListener("click", () => {
    const s = Number(stepInput.value);
    const w = Number(waterInput.value);
    const e = Number(exerciseInput.value);

    // Validation
    if (s < 0 || w < 0 || e < 0) {
        alert("Please enter positive values only!");
        return;
    }

    steps += s || 0;
    water += w || 0;
    exercise += e || 0;

    saveData();
    updateUI();

    // Clear inputs
    stepInput.value = "";
    waterInput.value = "";
    exerciseInput.value = "";
});

// Notifications
notifyBtn.addEventListener("click", () => {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("Reminders enabled!");

                // Example reminder every 1 hour
                setInterval(() => {
                    new Notification("Health Reminder 💧", {
                        body: "Time to drink water and move a bit!"
                    });
                }, 3600000); // 1 hour
            }
        });
    } else {
        alert("Notifications not supported in this browser.");
    }
});

// Initialize UI on load
updateUI();