// Show today's date
const today = new Date().toDateString();
document.getElementById("dateDisplay").innerText = today;

// Load saved data from localStorage
let activities = JSON.parse(localStorage.getItem("fitnessData")) || [];

// Filter today's entry (latest one with today's date)
let todayEntry = activities.reverse().find(entry => entry.date === today);

// Display data on dashboard
if (todayEntry) {
  document.getElementById("steps").innerText = todayEntry.steps;
  document.getElementById("workout").innerText = `${todayEntry.workout} - ${todayEntry.duration} min`;
  document.getElementById("calories").innerText = todayEntry.calories;
} else {
  document.getElementById("steps").innerText = 0;
  document.getElementById("workout").innerText = "-";
  document.getElementById("calories").innerText = 0;
}

// Button actions
function goToAdd() {
  window.location.href = "add.html";
}

function goToHistory() {
  window.location.href = "history.html";
}

// === Generate Weekly Chart ===

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    days.push(dateStr);
  }
  return days;
}

function getCaloriesPerDay(activities, last7Days) {
  const caloriesMap = {};
  last7Days.forEach(day => caloriesMap[day] = 0); // init all to 0

  activities.forEach(entry => {
    if (caloriesMap[entry.date] !== undefined) {
      caloriesMap[entry.date] += parseInt(entry.calories);
    }
  });

  return last7Days.map(day => caloriesMap[day]);
}

function getShortDayNames(dates) {
  return dates.map(dateStr => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: "short" });
  });
}

const last7Days = getLast7Days();
const caloriesData = getCaloriesPerDay(activities, last7Days);
const shortLabels = getShortDayNames(last7Days);

// Render chart
const ctx = document.getElementById("weeklyChart").getContext("2d");
const weeklyChart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: shortLabels,
    datasets: [{
      label: "Calories Burned",
      data: caloriesData,
      backgroundColor: "#2e86de"
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 500
      }
    }
  }
});

