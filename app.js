const THEME_KEY = 'symphony-theme';
const LANGUAGE_KEY = 'symphony-language';

const translations = {
    en: {
        pageTitle: 'Symphony Demo',
        heading: 'Welcome to Symphony Demo',
        description: 'This project demonstrates autonomous AI coding workflow.',
        switchLanguage: 'Switch to Chinese',
        languageButton: '中文',
        controlsLabel: 'Page controls',
        switchDark: 'Switch to dark mode',
        switchLight: 'Switch to light mode'
    },
    'zh-CN': {
        pageTitle: 'Symphony 演示',
        heading: '欢迎使用 Symphony 演示',
        description: '本项目用于展示自主 AI 编码工作流。',
        switchLanguage: '切换到英文',
        languageButton: 'English',
        controlsLabel: '页面控制',
        switchDark: '切换深色模式',
        switchLight: '切换浅色模式'
    }
};

function safeGetItem(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch(e) { return fallback; }
}

function safeSetItem(key, value) {
    try { localStorage.setItem(key, value); } catch(e) {}
}

function getTheme() {
    return safeGetItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) {
        const language = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'zh-CN' : 'en';
        const copy = translations[language];
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? copy.switchLight : copy.switchDark);
    }
    safeSetItem(THEME_KEY, theme);
}

function getLanguage() {
    const language = safeGetItem(LANGUAGE_KEY, 'en');
    return translations[language] ? language : 'en';
}

function applyLanguage(language) {
    const nextLanguage = translations[language] ? language : 'en';
    const copy = translations[nextLanguage];

    document.documentElement.setAttribute('lang', nextLanguage);
    document.title = copy.pageTitle;

    document.querySelectorAll('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n;
        if (copy[key]) element.textContent = copy[key];
    });

    const languageButton = document.getElementById('language-toggle');
    if (languageButton) {
        languageButton.textContent = copy.languageButton;
        languageButton.setAttribute('aria-label', copy.switchLanguage);
        languageButton.setAttribute('aria-pressed', nextLanguage === 'zh-CN' ? 'true' : 'false');
    }

    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.setAttribute('aria-label', theme === 'dark' ? copy.switchLight : copy.switchDark);
    }

    const controls = document.querySelector('.page-controls');
    if (controls) controls.setAttribute('aria-label', copy.controlsLabel);
    safeSetItem(LANGUAGE_KEY, nextLanguage);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Symphony Demo loaded');

    const theme = getTheme();
    applyTheme(theme);

    const language = getLanguage();
    applyLanguage(language);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    document.getElementById('language-toggle').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('lang') === 'zh-CN' ? 'en' : 'zh-CN';
        applyLanguage(next);
    });
});
