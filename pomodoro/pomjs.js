// DOM Elements
const workTittle = document.getElementById('work');
const breakTittle = document.getElementById('break');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const cycleButtons = document.querySelectorAll('.cycle-btn');
const themeToggleBtn = document.getElementById('theme-toggle');
const progressRing = document.getElementById('progress-ring');

// Timer State Variables
let workTime = 25; // Default work time
let breakTime = 5;  // Default break time
let currentMinutes = workTime;
let currentSeconds = 0;
let timerInterval = null;
let isPaused = false;
let isBreak = false;
let totalSecondsDuration = workTime * 60; // For progress ring

// Constants for SVG Ring
const ringCircumference = 754; // 2 * Math.PI * 120

// === Theme Management ===
const THEME_KEY = 'pomodoroTheme';

function setTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    } else {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    }
    localStorage.setItem(THEME_KEY, theme);
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Load theme on startup
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark'; // Default to dark
setTheme(savedTheme);


// === Cycle Selection ===
cycleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Don't allow cycle change while timer is active (or reset first)
        if (timerInterval !== null && !isPaused) {
             alert("Please pause or reset the timer to change cycles.");
             return;
        }

        workTime = parseInt(button.dataset.work);
        breakTime = parseInt(button.dataset.break);

        // Remove active class from all buttons
        cycleButtons.forEach(btn => btn.classList.remove('active-cycle'));
        // Add active class to the clicked button
        button.classList.add('active-cycle');

        // Reset the timer to reflect the new cycle
        resetTimer();
    });
});

// === Timer Display Update ===
function updateDisplay() {
    minutesDisplay.textContent = String(currentMinutes).padStart(2, '0');
    secondsDisplay.textContent = String(currentSeconds).padStart(2, '0');
}

// === Progress Ring Update ===
function updateProgressRing() {
    const elapsedSeconds = (totalSecondsDuration - (currentMinutes * 60 + currentSeconds));
    const progress = (elapsedSeconds / totalSecondsDuration);
    const dashoffset = ringCircumference * (1 - progress);
    progressRing.style.strokeDashoffset = Math.max(0, dashoffset); // Ensure offset doesn't go negative
}


// === Timer Logic ===
function timerTick() {
    if (isPaused) return;

    if (currentSeconds > 0) {
        currentSeconds--;
    } else if (currentMinutes > 0) {
        currentMinutes--;
        currentSeconds = 59;
    } else {
        // Timer reached zero
        isBreak = !isBreak; // Toggle between work and break
        switchSession();
        return; // Exit tick, switchSession handles restart
    }

    updateDisplay();
    updateProgressRing();
}

function switchSession() {
    clearInterval(timerInterval); // Stop previous interval
    timerInterval = null;

    if (isBreak) {
        currentMinutes = breakTime;
        totalSecondsDuration = breakTime * 60;
        workTittle.classList.remove('active-panel');
        breakTittle.classList.add('active-panel');
        // Optional: Play a sound for break start
    } else {
        currentMinutes = workTime;
        totalSecondsDuration = workTime * 60;
        breakTittle.classList.remove('active-panel');
        workTittle.classList.add('active-panel');
        // Optional: Play a sound for work start
    }
    currentSeconds = 0;
    updateDisplay();
    resetProgressRing(); // Reset ring for new session

    // Automatically start the next session
    startTimer();
}

function startTimer() {
    if (timerInterval !== null) return; // Already running

    isPaused = false;
    pauseBtn.style.display = 'flex'; // Show pause
    startBtn.style.display = 'none'; // Hide start

    // Set total duration if starting fresh (not resuming)
    if(currentMinutes === (isBreak ? breakTime : workTime) && currentSeconds === 0) {
         totalSecondsDuration = currentMinutes * 60;
         resetProgressRing(); // Ensure ring is empty at start
    }


    // Initial tick to avoid 1s delay, then set interval
    timerTick();
    timerInterval = setInterval(timerTick, 1000);
}

function pauseTimer() {
    if (timerInterval === null) return; // Not running

    isPaused = true;
    // We don't clear the interval, just stop the tick logic
    pauseBtn.style.display = 'none'; // Hide pause
    startBtn.style.display = 'flex'; // Show start (resume)
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; // Ensure it shows play icon
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isPaused = false;
    isBreak = false;

    currentMinutes = workTime; // Reset to selected work time
    currentSeconds = 0;
    totalSecondsDuration = workTime * 60;

    updateDisplay();
    resetProgressRing();

    // Reset panel and controls
    workTittle.classList.add('active-panel');
    breakTittle.classList.remove('active-panel');
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function resetProgressRing() {
     progressRing.style.transition = 'none'; // Disable transition for immediate reset
     progressRing.style.strokeDashoffset = ringCircumference;
     // Force reflow to apply the change immediately before re-enabling transition
     progressRing.offsetHeight; // Trigger reflow
     progressRing.style.transition = 'stroke-dashoffset 1s linear, stroke var(--transition-theme)';
}

// === Event Listeners ===
startBtn.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false; // Resume
        pauseBtn.style.display = 'flex';
        startBtn.style.display = 'none';
        // No need to restart interval if just resuming
    } else {
        startTimer(); // Start fresh or from beginning
    }
});

pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// === Initial Setup ===
window.onload = () => {
    // Set initial display based on default workTime
    resetTimer(); // Use reset to set initial state correctly
};