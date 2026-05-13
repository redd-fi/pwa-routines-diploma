// theme.js - управление темой оформления

function applyTheme(theme) {
    const body = document.body;
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    } else {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    }
    localStorage.setItem('theme', theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    console.log('loadTheme called, theme =', savedTheme);
    applyTheme(savedTheme);
}

// Автоматически загружаем тему при загрузке страницы
document.addEventListener('DOMContentLoaded', loadTheme);