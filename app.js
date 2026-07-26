const THEME_KEY = 'symphony-theme';
const LANGUAGE_KEY = 'symphony-language';

const translations = {
    en: {
        pageTitle: 'Countdown | Symphony Demo',
        runningTitle: 'MINUTE',
        languageButton: '中文',
        languageSwitch: 'Switch to Chinese',
        themeLight: 'Switch to light mode',
        themeDark: 'Switch to dark mode',
        brandAria: 'Back to countdown home',
        productLabel: 'Focus tool',
        sectionKicker: 'COUNTDOWN / 01',
        heading: 'Give time an ending.',
        intro: 'Focus on now. Let the countdown handle the rest.',
        hours: 'hours',
        hour: 'hour',
        minutes: 'minutes',
        minute: 'minute',
        seconds: 'seconds',
        second: 'second',
        remainingTime: 'Remaining time',
        ready: 'Ready to start',
        notSet: 'Not set',
        completed: 'Completed',
        complete: 'Complete',
        running: 'Counting down',
        expected: 'Expected',
        paused: 'Paused',
        resumeWaiting: 'Waiting to resume',
        startWaiting: 'Waiting to start',
        start: 'Start timer',
        pause: 'Pause timer',
        resume: 'Resume timer',
        reset: 'Reset',
        durationHeading: 'Set duration',
        hourLabel: 'Hours',
        minuteLabel: 'Minutes',
        secondLabel: 'Seconds',
        apply: 'Apply time',
        initialFeedback: 'Set between 0 and 99 hours.',
        inputFeedback: 'Click “Apply time” after entering a duration.',
        runningFeedback: 'The timer is running.',
        resetFeedback: 'Reset. Ready to start again.',
        invalidFeedback: 'Set a duration greater than 0.',
        setFeedback: (duration) => `Set to ${duration}.`,
        quickHeading: 'Common durations',
        statusHeading: 'Current status',
        statusReady: 'Ready for a focused stretch of time.',
        statusRunning: 'Focus is in progress.',
        statusPaused: 'The timer is paused. Continue whenever you are ready.',
        statusComplete: 'Time is up. Well done.',
        timerInfo: 'Countdown information',
        totalDuration: 'Total duration',
        progress: 'Progress'
    },
    'zh-CN': {
        pageTitle: '倒计时 | Symphony Demo',
        runningTitle: 'MINUTE',
        languageButton: 'English',
        languageSwitch: '切换到英文',
        themeLight: '切换浅色模式',
        themeDark: '切换深色模式',
        brandAria: '回到倒计时首页',
        productLabel: '专注工具',
        sectionKicker: 'COUNTDOWN / 01',
        heading: '给时间一个终点。',
        intro: '专注当下，剩下的交给倒计时。',
        hours: '小时',
        hour: '小时',
        minutes: '分钟',
        minute: '分钟',
        seconds: '秒',
        second: '秒',
        remainingTime: '剩余时间',
        ready: '准备开始',
        notSet: '尚未设置',
        completed: '已完成',
        complete: '完成',
        running: '计时中',
        expected: '预计',
        paused: '已暂停',
        resumeWaiting: '等待继续',
        startWaiting: '等待开始',
        start: '开始计时',
        pause: '暂停计时',
        resume: '继续计时',
        reset: '重置',
        durationHeading: '设置时长',
        hourLabel: '时',
        minuteLabel: '分',
        secondLabel: '秒',
        apply: '应用时间',
        initialFeedback: '可设置 0 至 99 小时。',
        inputFeedback: '输入后点击“应用时间”。',
        runningFeedback: '计时进行中。',
        resetFeedback: '已重置，可以重新开始。',
        invalidFeedback: '请先设置大于 0 的时长。',
        setFeedback: (duration) => `已设置 ${duration}。`,
        quickHeading: '常用时长',
        statusHeading: '当前状态',
        statusReady: '准备好开始一段专注时间。',
        statusRunning: '专注正在进行中。',
        statusPaused: '计时已暂停，随时可以继续。',
        statusComplete: '时间到。做得很好。',
        timerInfo: '倒计时信息',
        totalDuration: '总时长',
        progress: '进度'
    }
};

function getLanguage() {
    const documentLanguage = document.documentElement.getAttribute('lang');
    const language = translations[documentLanguage] ? documentLanguage : safeGetItem(LANGUAGE_KEY, 'zh-CN');
    return translations[language] ? language : 'zh-CN';
}

function getCopy() {
    return translations[getLanguage()];
}

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
        const label = isDark ? getCopy().themeLight : getCopy().themeDark;
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
    }
    safeSetItem(THEME_KEY, theme);
}

function applyLanguage(language) {
    const nextLanguage = translations[language] ? language : 'zh-CN';
    document.documentElement.setAttribute('lang', nextLanguage);
    safeSetItem(LANGUAGE_KEY, nextLanguage);

    const copy = translations[nextLanguage];
    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (copy[key] !== undefined && typeof copy[key] === 'string') {
            element.textContent = copy[key];
        }
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
        element.dataset.i18nAttr.split(',').forEach((mapping) => {
            const [attribute, key] = mapping.split(':');
            if (attribute && copy[key] !== undefined && typeof copy[key] === 'string') {
                element.setAttribute(attribute, copy[key]);
            }
        });
    });

    const languageButton = document.getElementById('language-toggle');
    if (languageButton) {
        languageButton.textContent = copy.languageButton;
        languageButton.setAttribute('aria-label', copy.languageSwitch);
        languageButton.setAttribute('title', copy.languageSwitch);
    }

    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const themeLabel = isDark ? copy.themeLight : copy.themeDark;
        themeButton.setAttribute('aria-label', themeLabel);
        themeButton.setAttribute('title', themeLabel);
    }

    if (elements) {
        updateDisplay();
    } else {
        document.title = copy.pageTitle;
    }
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
    const copy = getCopy();
    const parts = [];

    if (hours) parts.push(`${hours} ${hours === 1 ? copy.hour : copy.hours}`);
    if (minutes) parts.push(`${minutes} ${minutes === 1 ? copy.minute : copy.minutes}`);
    if (seconds || !parts.length) parts.push(`${seconds} ${seconds === 1 ? copy.second : copy.seconds}`);
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
    const copy = getCopy();
    document.title = timer.isRunning ? `${formatDuration(timer.remainingSeconds)} | ${copy.runningTitle}` : copy.pageTitle;
}

function updateStatusCopy() {
    const copy = getCopy();
    if (timer.remainingSeconds === 0 && timer.totalSeconds > 0) {
        elements.statusCopy.textContent = copy.statusComplete;
        elements.statusMark.classList.add('is-complete');
        return;
    }

    elements.statusMark.classList.remove('is-complete');
    if (timer.isRunning) {
        elements.statusCopy.textContent = copy.statusRunning;
    } else if (timer.totalSeconds > 0 && timer.remainingSeconds < timer.totalSeconds) {
        elements.statusCopy.textContent = copy.statusPaused;
    } else {
        elements.statusCopy.textContent = copy.statusReady;
    }
}

function updateDisplay() {
    const copy = getCopy();
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
    elements.countdownDisplay.setAttribute(
        'aria-label',
        `${copy.remainingTime} ${hours} ${copy.hours} ${minutes} ${copy.minutes} ${seconds} ${copy.seconds}`
    );
    elements.progressBar.style.width = `${progress}%`;
    elements.progressValue.textContent = `${progress}%`;
    elements.totalDuration.textContent = formatDurationText(timer.totalSeconds);

    if (timer.remainingSeconds === 0 && timer.totalSeconds > 0) {
        elements.timerState.textContent = copy.completed;
        elements.timerEnd.textContent = copy.complete;
    } else if (timer.isRunning) {
        elements.timerState.textContent = copy.running;
        const locale = getLanguage() === 'en' ? 'en-US' : 'zh-CN';
        const endTime = new Date(timer.endAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
        elements.timerEnd.textContent = `${copy.expected} ${endTime}`;
    } else if (timer.totalSeconds > 0 && timer.remainingSeconds < timer.totalSeconds) {
        elements.timerState.textContent = copy.paused;
        elements.timerEnd.textContent = copy.resumeWaiting;
    } else {
        elements.timerState.textContent = copy.ready;
        elements.timerEnd.textContent = timer.totalSeconds > 0 ? copy.startWaiting : copy.notSet;
    }

    elements.startLabel.textContent = timer.isRunning ? copy.pause : (timer.remainingSeconds < timer.totalSeconds ? copy.resume : copy.start);
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
    const copy = getCopy();
    if (timer.remainingSeconds === 0) {
        const duration = readDurationInputs();
        if (duration.totalSeconds === 0) {
            elements.formFeedback.textContent = copy.invalidFeedback;
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
    elements.formFeedback.textContent = copy.runningFeedback;
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
    const copy = getCopy();
    stopInterval();
    timer.isRunning = false;
    timer.endAt = null;
    const duration = readDurationInputs();
    timer.totalSeconds = duration.totalSeconds;
    timer.remainingSeconds = duration.totalSeconds;
    if (duration.wasAdjusted) writeDurationInputs(duration.totalSeconds);
    elements.formFeedback.textContent = copy.resetFeedback;
    elements.formFeedback.classList.remove('is-error');
    updateDisplay();
}

function applyDuration(event) {
    const copy = getCopy();
    event.preventDefault();
    stopInterval();
    timer.isRunning = false;
    timer.endAt = null;
    const duration = readDurationInputs();

    if (duration.wasAdjusted) writeDurationInputs(duration.totalSeconds);
    timer.totalSeconds = duration.totalSeconds;
    timer.remainingSeconds = duration.totalSeconds;
    elements.formFeedback.textContent = duration.totalSeconds > 0
        ? copy.setFeedback(formatDurationText(duration.totalSeconds))
        : copy.invalidFeedback;
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
    applyLanguage(getLanguage());
    applyTheme(getTheme());

    const initialDuration = readDurationInputs();
    timer.totalSeconds = initialDuration.totalSeconds;
    timer.remainingSeconds = initialDuration.totalSeconds;
    updateDisplay();

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    document.getElementById('language-toggle').addEventListener('click', () => {
        const nextLanguage = getLanguage() === 'en' ? 'zh-CN' : 'en';
        applyLanguage(nextLanguage);
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
            elements.formFeedback.textContent = getCopy().inputFeedback;
            elements.formFeedback.classList.remove('is-error');
        });
    });
});
