import { initializePieChart } from './features/echarts/pie-chart.js';
import { createLogin } from './features/login/login.js';

const THEME_KEY = 'symphony-theme';

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
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? '切换浅色模式' : '切换深色模式');
    }
    safeSetItem(THEME_KEY, theme);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Symphony Demo loaded');

    const theme = getTheme();
    applyTheme(theme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    createLogin(document.getElementById('login-app'));
    const pie = initializePieChart('traffic-pie', { title: '访问来源' });
    document.getElementById('refresh-pie').addEventListener('click', () => pie.refresh());
    window.addEventListener('resize', pie.resize);
});
