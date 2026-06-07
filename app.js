const THEME_KEY = 'symphony-theme';

function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Symphony Demo loaded');

    const theme = getTheme();
    applyTheme(theme);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });
});
