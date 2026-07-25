const THEME_KEY = 'symphony-theme';

function safeGetItem(key, fallback) {
    try {
        return localStorage.getItem(key) || fallback;
    } catch (error) {
        return fallback;
    }
}

function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {}
}

function getTheme() {
    return safeGetItem(THEME_KEY, 'light');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const button = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (button && icon) {
        const isDark = theme === 'dark';
        icon.textContent = isDark ? '☼' : '◐';
        button.setAttribute('aria-label', isDark ? '切换浅色模式' : '切换深色模式');
        button.setAttribute('title', isDark ? '切换浅色模式' : '切换深色模式');
    }
    safeSetItem(THEME_KEY, theme);
}

const timer = {
    totalSeconds: 0,
    remainingSeconds: 0,
    endAt: null,
    intervalId: null,
    isRunning: false
};

let elements;

function formatNumber(value) {
    return String(value).padStart(2, '0');
}

function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

function formatDurationText(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];

    if (hours) parts.push(`${hours} 小时`);
    if (minutes) parts.push(`${minutes} 分钟`);
    if (seconds || !parts.length) parts.push(`${seconds} 秒`);
    return parts.join(' ');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function readDurationInputs() {
    const rawValues = [
        Number.parseInt(elements.hoursInput.value, 10) || 0,
        Number.parseInt(elements.minutesInput.value, 10) || 0,
        Number.parseInt(elements.secondsInput.value, 10) || 0
    ];
    const values = [
        clamp(rawValues[0], 0, 99),
        clamp(rawValues[1], 0, 59),
        clamp(rawValues[2], 0, 59)
    ];
    const wasAdjusted = values.some((value, index) => value !== rawValues[index]);

    return {
        hours: values[0],
        minutes: values[1],
        seconds: values[2],
        totalSeconds: values[0] * 3600 + values[1] * 60 + values[2],
        wasAdjusted
    };
}

function writeDurationInputs(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    elements.hoursInput.value = hours;
    elements.minutesInput.value = minutes;
    elements.secondsInput.value = seconds;
}

function updateDocumentTitle() {
    document.title = timer.isRunning ? `${formatDuration(timer.remainingSeconds)} | MINUTE` : '倒计时 | Symphony Demo';
}

function updateStatusCopy() {
    if (timer.remainingSeconds === 0 && timer.totalSeconds > 0) {
        elements.statusCopy.textContent = '时间到。做得很好。';
        elements.statusMark.classList.add('is-complete');
        return;
    }

    elements.statusMark.classList.remove('is-complete');
    if (timer.isRunning) {
        elements.statusCopy.textContent = '专注正在进行中。';
    } else if (timer.totalSeconds > 0 && timer.remainingSeconds < timer.totalSeconds) {
        elements.statusCopy.textContent = '计时已暂停，随时可以继续。';
    } else {
        elements.statusCopy.textContent = '准备好开始一段专注时间。';
    }
}

function updateDisplay() {
    const remaining = Math.max(0, timer.remainingSeconds);
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const progress = timer.totalSeconds > 0
        ? Math.round(((timer.totalSeconds - remaining) / timer.totalSeconds) * 100)
        : 0;

    elements.hoursDisplay.textContent = formatNumber(hours);
    elements.minutesDisplay.textContent = formatNumber(minutes);
    elements.secondsDisplay.textContent = formatNumber(seconds);
    elements.countdownDisplay.setAttribute('aria-label', `剩余时间 ${hours} 小时 ${minutes} 分 ${seconds} 秒`);
    elements.progressBar.style.width = `${progress}%`;
    elements.progressValue.textContent = `${progress}%`;
    elements.totalDuration.textContent = formatDurationText(timer.totalSeconds);

    if (timer.remainingSeconds === 0 && timer.totalSeconds > 0) {
        elements.timerState.textContent = '已完成';
        elements.timerEnd.textContent = '完成';
    } else if (timer.isRunning) {
        elements.timerState.textContent = '计时中';
        elements.timerEnd.textContent = `预计 ${new Date(timer.endAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (timer.totalSeconds > 0 && timer.remainingSeconds < timer.totalSeconds) {
        elements.timerState.textContent = '已暂停';
        elements.timerEnd.textContent = '等待继续';
    } else {
        elements.timerState.textContent = '准备开始';
        elements.timerEnd.textContent = timer.totalSeconds > 0 ? '等待开始' : '尚未设置';
    }

    elements.startLabel.textContent = timer.isRunning ? '暂停计时' : (timer.remainingSeconds < timer.totalSeconds ? '继续计时' : '开始计时');
    elements.startIcon.textContent = timer.isRunning ? 'Ⅱ' : '▶';
    updateStatusCopy();
    updateDocumentTitle();
}

function stopInterval() {
    if (timer.intervalId !== null) {
        window.clearInterval(timer.intervalId);
        timer.intervalId = null;
    }
}

function tick() {
    if (!timer.isRunning || timer.endAt === null) return;
    timer.remainingSeconds = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));

    if (timer.remainingSeconds === 0) {
        timer.isRunning = false;
        timer.endAt = null;
        stopInterval();
    }
    updateDisplay();
}

function startTimer() {
    if (timer.remainingSeconds === 0) {
        const duration = readDurationInputs();
        if (duration.totalSeconds === 0) {
            elements.formFeedback.textContent = '请先设置大于 0 的时长。';
            elements.formFeedback.classList.add('is-error');
            elements.hoursInput.focus();
            return;
        }
        timer.totalSeconds = duration.totalSeconds;
        timer.remainingSeconds = duration.totalSeconds;
    }

    timer.isRunning = true;
    timer.endAt = Date.now() + timer.remainingSeconds * 1000;
    stopInterval();
    timer.intervalId = window.setInterval(tick, 250);
    elements.formFeedback.textContent = '计时进行中。';
    elements.formFeedback.classList.remove('is-error');
    updateDisplay();
}

function pauseTimer() {
    tick();
    timer.isRunning = false;
    timer.endAt = null;
    stopInterval();
    updateDisplay();
}

function resetTimer() {
    stopInterval();
    timer.isRunning = false;
    timer.endAt = null;
    const duration = readDurationInputs();
    timer.totalSeconds = duration.totalSeconds;
    timer.remainingSeconds = duration.totalSeconds;
    if (duration.wasAdjusted) writeDurationInputs(duration.totalSeconds);
    elements.formFeedback.textContent = '已重置，可以重新开始。';
    elements.formFeedback.classList.remove('is-error');
    updateDisplay();
}

function applyDuration(event) {
    event.preventDefault();
    stopInterval();
    timer.isRunning = false;
    timer.endAt = null;
    const duration = readDurationInputs();

    if (duration.wasAdjusted) writeDurationInputs(duration.totalSeconds);
    timer.totalSeconds = duration.totalSeconds;
    timer.remainingSeconds = duration.totalSeconds;
    elements.formFeedback.textContent = duration.totalSeconds > 0
        ? `已设置 ${formatDurationText(duration.totalSeconds)}。`
        : '请先设置大于 0 的时长。';
    elements.formFeedback.classList.toggle('is-error', duration.totalSeconds === 0);
    updateQuickSelection(duration.totalSeconds);
    updateDisplay();
}

function updateQuickSelection(totalSeconds) {
    document.querySelectorAll('.quick-button').forEach((button) => {
        const isSelected = Number(button.dataset.minutes) * 60 === totalSeconds;
        button.classList.toggle('is-selected', isSelected);
    });
}

function selectQuickDuration(button) {
    const minutes = Number(button.dataset.minutes);
    writeDurationInputs(minutes * 60);
    applyDuration({ preventDefault: () => {} });
}

function cacheElements() {
    elements = {
        countdownDisplay: document.getElementById('countdown-display'),
        hoursDisplay: document.getElementById('hours-display'),
        minutesDisplay: document.getElementById('minutes-display'),
        secondsDisplay: document.getElementById('seconds-display'),
        progressBar: document.getElementById('progress-bar'),
        progressValue: document.getElementById('progress-value'),
        totalDuration: document.getElementById('total-duration'),
        timerState: document.getElementById('timer-state'),
        timerEnd: document.getElementById('timer-end'),
        startButton: document.getElementById('start-button'),
        startIcon: document.getElementById('start-icon'),
        startLabel: document.getElementById('start-label'),
        resetButton: document.getElementById('reset-button'),
        durationForm: document.getElementById('duration-form'),
        hoursInput: document.getElementById('hours-input'),
        minutesInput: document.getElementById('minutes-input'),
        secondsInput: document.getElementById('seconds-input'),
        formFeedback: document.getElementById('form-feedback'),
        statusCopy: document.getElementById('status-copy'),
        statusMark: document.getElementById('status-mark')
    };
}

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    applyTheme(getTheme());

    const initialDuration = readDurationInputs();
    timer.totalSeconds = initialDuration.totalSeconds;
    timer.remainingSeconds = initialDuration.totalSeconds;
    updateDisplay();

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    elements.startButton.addEventListener('click', () => {
        if (timer.isRunning) pauseTimer();
        else startTimer();
    });
    elements.resetButton.addEventListener('click', resetTimer);
    elements.durationForm.addEventListener('submit', applyDuration);

    document.querySelectorAll('.quick-button').forEach((button) => {
        button.addEventListener('click', () => selectQuickDuration(button));
    });

    [elements.hoursInput, elements.minutesInput, elements.secondsInput].forEach((input) => {
        input.addEventListener('input', () => {
            elements.formFeedback.textContent = '输入后点击“应用时间”。';
            elements.formFeedback.classList.remove('is-error');
        });
    });
});
