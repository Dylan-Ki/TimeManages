// Time Manager - JavaScript Logic

// Global variables
let timerInterval = null;
let pomodoroInterval = null;
let clockInterval = null;

// State management
const timerState = {
    isRunning: false,
    totalSeconds: 0,
    remainingSeconds: 0,
    startTime: null
};

const pomodoroState = {
    isRunning: false,
    currentPhase: 'work', // 'work', 'shortBreak', 'longBreak'
    currentCycle: 0,
    totalSeconds: 0,
    remainingSeconds: 0,
    settings: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        cyclesBeforeLong: 4
    }
};

let currentDate = new Date();

// Audio context for notifications
let audioContext = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    try {
        initializeClock();
        initializeTimer();
        initializePomodoro();
        initializeCalendar();
        initializeNotifications();
        loadSettings();
        
        // Start real-time updates
        updateDateTime();
        clockInterval = setInterval(updateDateTime, 1000);
        
        // Add fade-in animation to cards
        setTimeout(() => {
            document.querySelectorAll('.card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, index * 100);
            });
        }, 100);
        
        console.log('Time Manager initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Clock functionality
function initializeClock() {
    const clockNumbers = document.getElementById('clock-numbers');
    
    // Create clock numbers
    for (let i = 1; i <= 12; i++) {
        const number = document.createElement('div');
        number.className = 'clock-number';
        number.textContent = i;
        
        const angle = (i * 30 - 90) * Math.PI / 180;
        const radius = 75;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        
        number.style.left = `calc(50% + ${x}px - 7px)`;
        number.style.top = `calc(50% + ${y}px - 7px)`;
        
        clockNumbers.appendChild(number);
    }
}

function updateDateTime() {
    const now = new Date();
    
    try {
        // Update digital time
        const timeString = now.toLocaleTimeString('vi-VN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const digitalTimeElement = document.getElementById('digital-time');
        if (digitalTimeElement) {
            digitalTimeElement.textContent = timeString;
        }
        
        // Update date
        const dateString = now.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const currentDateElement = document.getElementById('current-date');
        if (currentDateElement) {
            currentDateElement.textContent = dateString;
        }
        
        // Update clock hands with smooth animation
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        const hourDeg = (hours * 30) + (minutes * 0.5);
        const minuteDeg = minutes * 6;
        const secondDeg = seconds * 6;
        
        const hourHand = document.getElementById('hour-hand');
        const minuteHand = document.getElementById('minute-hand');
        const secondHand = document.getElementById('second-hand');
        
        if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
        if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
        
    } catch (error) {
        console.error('Error updating date/time:', error);
    }
}

// Timer functionality
function initializeTimer() {
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    
    // Add input validation
    ['timer-hours', 'timer-minutes', 'timer-seconds'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', validateTimerInput);
            input.addEventListener('change', saveSettings);
        }
    });
}

function validateTimerInput(event) {
    const input = event.target;
    const value = parseInt(input.value);
    const max = parseInt(input.max);
    const min = parseInt(input.min);
    
    if (value > max) input.value = max;
    if (value < min) input.value = min;
}

function startTimer() {
    if (!timerState.isRunning) {
        if (timerState.remainingSeconds === 0) {
            const hours = parseInt(document.getElementById('timer-hours')?.value) || 0;
            const minutes = parseInt(document.getElementById('timer-minutes')?.value) || 0;
            const seconds = parseInt(document.getElementById('timer-seconds')?.value) || 0;
            
            timerState.totalSeconds = hours * 3600 + minutes * 60 + seconds;
            timerState.remainingSeconds = timerState.totalSeconds;
        }
        
        if (timerState.remainingSeconds > 0) {
            timerState.isRunning = true;
            timerState.startTime = Date.now();
            timerInterval = setInterval(updateTimer, 100); // More frequent updates for smoother animation
            
            const startBtn = document.getElementById('timer-start');
            if (startBtn) {
                startBtn.textContent = 'Đang chạy...';
                startBtn.disabled = true;
            }
        } else {
            showNotification('Lỗi', 'Vui lòng thiết lập thời gian hợp lệ!');
        }
    }
}

function pauseTimer() {
    if (timerState.isRunning) {
        timerState.isRunning = false;
        clearInterval(timerInterval);
        
        const startBtn = document.getElementById('timer-start');
        if (startBtn) {
            startBtn.textContent = 'Tiếp tục';
            startBtn.disabled = false;
        }
    }
}

function resetTimer() {
    timerState.isRunning = false;
    timerState.remainingSeconds = 0;
    timerState.startTime = null;
    clearInterval(timerInterval);
    
    const displayElement = document.getElementById('timer-display');
    const progressElement = document.getElementById('timer-progress');
    const startBtn = document.getElementById('timer-start');
    
    if (displayElement) {
        displayElement.textContent = '00:00:00';
        displayElement.classList.remove('pulse');
    }
    if (progressElement) progressElement.style.width = '0%';
    if (startBtn) {
        startBtn.textContent = 'Bắt đầu';
        startBtn.disabled = false;
    }
}

function updateTimer() {
    if (timerState.remainingSeconds > 0) {
        timerState.remainingSeconds--;
        
        const hours = Math.floor(timerState.remainingSeconds / 3600);
        const minutes = Math.floor((timerState.remainingSeconds % 3600) / 60);
        const seconds = timerState.remainingSeconds % 60;
        
        const displayElement = document.getElementById('timer-display');
        if (displayElement) {
            displayElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        const progress = ((timerState.totalSeconds - timerState.remainingSeconds) / timerState.totalSeconds) * 100;
        const progressElement = document.getElementById('timer-progress');
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        
        if (timerState.remainingSeconds === 0) {
            timerCompleted();
        }
    }
}

function timerCompleted() {
    timerState.isRunning = false;
    clearInterval(timerInterval);
    
    const startBtn = document.getElementById('timer-start');
    const displayElement = document.getElementById('timer-display');
    
    if (startBtn) {
        startBtn.textContent = 'Bắt đầu';
        startBtn.disabled = false;
    }
    
    if (displayElement) {
        displayElement.classList.add('pulse');
    }
    
    // Show notification and play sound
    showNotification('Hết thời gian!', 'Bộ đếm ngược đã hoàn thành.');
    playNotificationSound();
    
    setTimeout(() => {
        if (displayElement) {
            displayElement.classList.remove('pulse');
        }
    }, 5000);
}

// Pomodoro functionality
function initializePomodoro() {
    const startBtn = document.getElementById('pomodoro-start');
    const pauseBtn = document.getElementById('pomodoro-pause');
    const resetBtn = document.getElementById('pomodoro-reset');
    
    if (startBtn) startBtn.addEventListener('click', startPomodoro);
    if (pauseBtn) pauseBtn.addEventListener('click', pausePomodoro);
    if (resetBtn) resetBtn.addEventListener('click', resetPomodoro);
    
    // Add settings change listeners
    ['work-duration', 'short-break', 'long-break', 'cycles-before-long'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('change', () => {
                updatePomodoroSettings();
                updatePomodoroDisplay();
                saveSettings();
            });
        }
    });
    
    updatePomodoroDisplay();
}

function updatePomodoroSettings() {
    pomodoroState.settings = {
        workDuration: parseInt(document.getElementById('work-duration')?.value) || 25,
        shortBreak: parseInt(document.getElementById('short-break')?.value) || 5,
        longBreak: parseInt(document.getElementById('long-break')?.value) || 15,
        cyclesBeforeLong: parseInt(document.getElementById('cycles-before-long')?.value) || 4
    };
}

function startPomodoro() {
    if (!pomodoroState.isRunning) {
        if (pomodoroState.remainingSeconds === 0) {
            setupPomodoroPhase();
        }
        
        pomodoroState.isRunning = true;
        pomodoroInterval = setInterval(updatePomodoro, 1000);
        
        const startBtn = document.getElementById('pomodoro-start');
        if (startBtn) {
            startBtn.textContent = 'Đang chạy...';
            startBtn.disabled = true;
        }
    }
}

function pausePomodoro() {
    if (pomodoroState.isRunning) {
        pomodoroState.isRunning = false;
        clearInterval(pomodoroInterval);
        
        const startBtn = document.getElementById('pomodoro-start');
        if (startBtn) {
            startBtn.textContent = 'Tiếp tục';
            startBtn.disabled = false;
        }
    }
}

function resetPomodoro() {
    pomodoroState.isRunning = false;
    pomodoroState.currentPhase = 'work';
    pomodoroState.currentCycle = 0;
    pomodoroState.remainingSeconds = 0;
    clearInterval(pomodoroInterval);
    
    updatePomodoroDisplay();
    
    const startBtn = document.getElementById('pomodoro-start');
    const progressElement = document.getElementById('pomodoro-progress');
    
    if (startBtn) {
        startBtn.textContent = 'Bắt đầu';
        startBtn.disabled = false;
    }
    if (progressElement) progressElement.style.width = '0%';
}

function setupPomodoroPhase() {
    updatePomodoroSettings();
    
    let duration;
    switch (pomodoroState.currentPhase) {
        case 'work':
            duration = pomodoroState.settings.workDuration * 60;
            break;
        case 'shortBreak':
            duration = pomodoroState.settings.shortBreak * 60;
            break;
        case 'longBreak':
            duration = pomodoroState.settings.longBreak * 60;
            break;
        default:
            duration = pomodoroState.settings.workDuration * 60;
    }
    
    pomodoroState.totalSeconds = duration;
    pomodoroState.remainingSeconds = duration;
}

function updatePomodoro() {
    if (pomodoroState.remainingSeconds > 0) {
        pomodoroState.remainingSeconds--;
        
        const minutes = Math.floor(pomodoroState.remainingSeconds / 60);
        const seconds = pomodoroState.remainingSeconds % 60;
        
        const displayElement = document.getElementById('pomodoro-display');
        if (displayElement) {
            displayElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        const progress = ((pomodoroState.totalSeconds - pomodoroState.remainingSeconds) / pomodoroState.totalSeconds) * 100;
        const progressElement = document.getElementById('pomodoro-progress');
        if (progressElement) {
            progressElement.style.width = `${progress}%`;
        }
        
        if (pomodoroState.remainingSeconds === 0) {
            pomodoroPhaseCompleted();
        }
    }
}

function pomodoroPhaseCompleted() {
    pomodoroState.isRunning = false;
    clearInterval(pomodoroInterval);
    
    const phaseNames = {
        'work': 'Thời gian làm việc',
        'shortBreak': 'Nghỉ ngắn',
        'longBreak': 'Nghỉ dài'
    };
    
    const currentPhaseName = phaseNames[pomodoroState.currentPhase];
    
    // Determine next phase
    if (pomodoroState.currentPhase === 'work') {
        pomodoroState.currentCycle++;
        
        if (pomodoroState.currentCycle % pomodoroState.settings.cyclesBeforeLong === 0) {
            pomodoroState.currentPhase = 'longBreak';
        } else {
            pomodoroState.currentPhase = 'shortBreak';
        }
    } else {
        pomodoroState.currentPhase = 'work';
    }
    
    const nextPhaseName = phaseNames[pomodoroState.currentPhase];
    
    pomodoroState.remainingSeconds = 0;
    updatePomodoroDisplay();
    
    const startBtn = document.getElementById('pomodoro-start');
    if (startBtn) {
        startBtn.textContent = 'Bắt đầu';
        startBtn.disabled = false;
    }
    
    // Show notification
    showNotification(
        `${currentPhaseName} hoàn thành!`,
        `Chuyển sang: ${nextPhaseName}`
    );
    playNotificationSound();
    
    // Auto-start next phase after 3 seconds (optional)
    setTimeout(() => {
        if (!pomodoroState.isRunning) {
            const autoStart = confirm(`Bắt đầu ${nextPhaseName}?`);
            if (autoStart) {
                startPomodoro();
            }
        }
    }, 3000);
}

function updatePomodoroDisplay() {
    const statusElement = document.getElementById('pomodoro-status');
    const cycleElement = document.getElementById('cycle-counter');
    const displayElement = document.getElementById('pomodoro-display');
    
    const phaseNames = {
        'work': 'Thời gian làm việc',
        'shortBreak': 'Nghỉ ngắn',
        'longBreak': 'Nghỉ dài'
    };
    
    const phaseClasses = {
        'work': 'status-work',
        'shortBreak': 'status-break',
        'longBreak': 'status-long-break'
    };
    
    if (statusElement) {
        statusElement.textContent = phaseNames[pomodoroState.currentPhase] || 'Sẵn sàng bắt đầu';
        statusElement.className = `status-text ${phaseClasses[pomodoroState.currentPhase] || ''}`;
    }
    
    if (cycleElement) {
        cycleElement.textContent = `Chu kỳ: ${pomodoroState.currentCycle}/${pomodoroState.settings.cyclesBeforeLong}`;
    }
    
    if (displayElement && pomodoroState.remainingSeconds === 0) {
        const duration = pomodoroState.currentPhase === 'work' 
            ? pomodoroState.settings.workDuration 
            : pomodoroState.currentPhase === 'shortBreak'
            ? pomodoroState.settings.shortBreak
            : pomodoroState.settings.longBreak;
        
        displayElement.textContent = `${duration.toString().padStart(2, '0')}:00`;
    }
}

// Calendar functionality
function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    renderCalendar();
    updateTodayInfo();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update title
    const monthNames = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];
    
    const titleElement = document.getElementById('calendar-title');
    if (titleElement) {
        titleElement.textContent = `${monthNames[month]} ${year}`;
    }
    
    // Clear previous days
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    calendarDays.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        emptyDay.textContent = prevMonthLastDay - startingDayOfWeek + i + 1;
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the current month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if this is today
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Add click event for day selection
        dayElement.addEventListener('click', () => {
            document.querySelectorAll('.calendar-day.selected').forEach(el => {
                el.classList.remove('selected');
            });
            dayElement.classList.add('selected');
        });
        
        calendarDays.appendChild(dayElement);
    }
    
    // Add days from next month to fill the grid
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells && remainingCells < 7; day++) {
        const nextMonthDay = document.createElement('div');
        nextMonthDay.className = 'calendar-day other-month';
        nextMonthDay.textContent = day;
        calendarDays.appendChild(nextMonthDay);
    }
}

function updateTodayInfo() {
    const today = new Date();
    const todayString = today.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const todayInfoElement = document.getElementById('today-info');
    if (todayInfoElement) {
        todayInfoElement.textContent = todayString;
    }
}

// Notification functionality
function initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
}

function showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'time-manager',
            requireInteraction: true
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // Auto close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
    } else {
        // Fallback to alert if notifications are not supported
        alert(`${title}\n${body}`);
    }
}

// Audio notification
function playNotificationSound() {
    try {
        // Create audio context if not exists
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create a simple beep sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio notification not supported:', error);
    }
}

// Settings management
function saveSettings() {
    try {
        const settings = {
            timer: {
                hours: document.getElementById('timer-hours')?.value || 0,
                minutes: document.getElementById('timer-minutes')?.value || 5,
                seconds: document.getElementById('timer-seconds')?.value || 0
            },
            pomodoro: {
                workDuration: document.getElementById('work-duration')?.value || 25,
                shortBreak: document.getElementById('short-break')?.value || 5,
                longBreak: document.getElementById('long-break')?.value || 15,
                cyclesBeforeLong: document.getElementById('cycles-before-long')?.value || 4
            },
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('timeManagerSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function loadSettings() {
    try {
        const savedSettings = localStorage.getItem('timeManagerSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Load timer settings
            if (settings.timer) {
                const hoursInput = document.getElementById('timer-hours');
                const minutesInput = document.getElementById('timer-minutes');
                const secondsInput = document.getElementById('timer-seconds');
                
                if (hoursInput) hoursInput.value = settings.timer.hours;
                if (minutesInput) minutesInput.value = settings.timer.minutes;
                if (secondsInput) secondsInput.value = settings.timer.seconds;
            }
            
            // Load pomodoro settings
            if (settings.pomodoro) {
                const workInput = document.getElementById('work-duration');
                const shortBreakInput = document.getElementById('short-break');
                const longBreakInput = document.getElementById('long-break');
                const cyclesInput = document.getElementById('cycles-before-long');
                
                if (workInput) workInput.value = settings.pomodoro.workDuration;
                if (shortBreakInput) shortBreakInput.value = settings.pomodoro.shortBreak;
                if (longBreakInput) longBreakInput.value = settings.pomodoro.longBreak;
                if (cyclesInput) cyclesInput.value = settings.pomodoro.cyclesBeforeLong;
            }
            
            console.log('Settings loaded successfully');
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Utility functions
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Space bar to start/pause timer
    if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
        event.preventDefault();
        
        if (timerState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    // R key to reset timer
    if (event.code === 'KeyR' && event.ctrlKey) {
        event.preventDefault();
        resetTimer();
    }
    
    // P key to start/pause pomodoro
    if (event.code === 'KeyP' && event.ctrlKey) {
        event.preventDefault();
        
        if (pomodoroState.isRunning) {
            pausePomodoro();
        } else {
            startPomodoro();
        }
    }
});

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, save current state
        saveSettings();
    } else {
        // Page is visible, update time display
        updateDateTime();
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearInterval(timerInterval);
    clearInterval(pomodoroInterval);
    clearInterval(clockInterval);
    saveSettings();
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        debounce,
        timerState,
        pomodoroState
    };
}