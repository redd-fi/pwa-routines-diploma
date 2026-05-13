// ==================== app.js - Main Application Logic ====================

// ==================== SAMPLE ROUTINES DATA (РУССКИЕ ОБРАЗЦЫ) ====================

let routines = [
    {
        id: 1,
        name: 'Утренний распорядок',
        color: '#4A90E2',
        repeatDays: [1, 2, 3, 4, 5],
        steps: [
            { id: 1, name: 'Встать с кровати', order: 0 },
            { id: 2, name: 'Сделать зарядку', order: 1 },
            { id: 3, name: 'Позавтракать', order: 2 }
        ],
        timeStart: '08:00',
        timeEnd: '09:00',
        description: 'Начни день с энергии',
        status: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Рабочий распорядок',
        color: '#34C759',
        repeatDays: [1, 2, 3, 4, 5],
        steps: [
            { id: 1, name: 'Проверить почту', order: 0 },
            { id: 2, name: 'Составить план задач', order: 1 },
            { id: 3, name: 'Выполнить главную задачу', order: 2 }
        ],
        timeStart: '10:00',
        timeEnd: '18:00',
        description: 'Эффективный рабочий день',
        status: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Вечерний распорядок',
        color: '#AF52DE',
        repeatDays: [1, 2, 3, 4, 5, 6, 0],
        steps: [
            { id: 1, name: 'Почистить зубы', order: 0 },
            { id: 2, name: 'Почитать книгу', order: 1 },
            { id: 3, name: 'Помедитировать', order: 2 }
        ],
        timeStart: '22:00',
        timeEnd: '23:00',
        description: 'Расслабься перед сном',
        status: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        name: 'Активный выходной',
        color: '#FF9F4A',
        repeatDays: [6, 0],
        steps: [
            { id: 1, name: 'Пробежка', order: 0 },
            { id: 2, name: 'Здоровый завтрак', order: 1 },
            { id: 3, name: 'Прогулка на свежем воздухе', order: 2 }
        ],
        timeStart: '09:00',
        timeEnd: '11:00',
        description: 'Активно проведи выходной',
        status: 'upcoming',
        createdAt: new Date().toISOString()
    }
];

window.routines = routines;

// ==================== HELPER FUNCTIONS ====================

function saveRoutinesToLocalStorage() {
    localStorage.setItem('routines', JSON.stringify(routines));
    window.routines = routines;
}

function loadRoutinesFromLocalStorage() {
    const saved = localStorage.getItem('routines');
    if (saved) {
        try {
            routines = JSON.parse(saved);
            window.routines = routines;
        } catch (e) {
            console.error('Failed to parse routines from localStorage', e);
            routines = getSampleRoutines();
            saveRoutinesToLocalStorage();
        }
    } else {
        routines = getSampleRoutines();
        saveRoutinesToLocalStorage();
    }
}

function getSampleRoutines() {
    return [
        {
            id: 1,
            name: 'Утренний распорядок',
            color: '#4A90E2',
            repeatDays: [1, 2, 3, 4, 5],
            steps: [
                { id: 1, name: 'Встать с кровати', order: 0 },
                { id: 2, name: 'Сделать зарядку', order: 1 },
                { id: 3, name: 'Позавтракать', order: 2 }
            ],
            timeStart: '08:00',
            timeEnd: '09:00',
            description: 'Начни день с энергии',
            status: 'upcoming',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Рабочий распорядок',
            color: '#34C759',
            repeatDays: [1, 2, 3, 4, 5],
            steps: [
                { id: 1, name: 'Проверить почту', order: 0 },
                { id: 2, name: 'Составить план задач', order: 1 },
                { id: 3, name: 'Выполнить главную задачу', order: 2 }
            ],
            timeStart: '10:00',
            timeEnd: '18:00',
            description: 'Эффективный рабочий день',
            status: 'upcoming',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Вечерний распорядок',
            color: '#AF52DE',
            repeatDays: [1, 2, 3, 4, 5, 6, 0],
            steps: [
                { id: 1, name: 'Почистить зубы', order: 0 },
                { id: 2, name: 'Почитать книгу', order: 1 },
                { id: 3, name: 'Помедитировать', order: 2 }
            ],
            timeStart: '22:00',
            timeEnd: '23:00',
            description: 'Расслабься перед сном',
            status: 'upcoming',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Активный выходной',
            color: '#FF9F4A',
            repeatDays: [6, 0],
            steps: [
                { id: 1, name: 'Пробежка', order: 0 },
                { id: 2, name: 'Здоровый завтрак', order: 1 },
                { id: 3, name: 'Прогулка на свежем воздухе', order: 2 }
            ],
            timeStart: '09:00',
            timeEnd: '11:00',
            description: 'Активно проведи выходной',
            status: 'upcoming',
            createdAt: new Date().toISOString()
        }
    ];
}

function createSection(title, count) {
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `
        <div class="section-header">
            <span class="section-title">${title}</span>
            <span class="section-count">(${count})</span>
        </div>
        <div class="routines-list"></div>
    `;
    return section;
}

// ==================== STATUS LOGIC ====================

function getRoutineStatus(routine) {
    if (!routine.timeStart) return 'active';
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    const [startHour, startMinute] = routine.timeStart.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMinute;
    
    let endTimeMinutes = startTimeMinutes + 60;
    if (routine.timeEnd) {
        const [endHour, endMinute] = routine.timeEnd.split(':').map(Number);
        endTimeMinutes = endHour * 60 + endMinute;
    }
    
    if (currentTimeMinutes < startTimeMinutes) return 'upcoming';
    else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) return 'active';
    else return 'missed';
}

function updateAllRoutineStatuses() {
    routines.forEach(routine => {
        if (routine.status !== 'completed' && routine.status !== 'skipped') {
            routine.status = getRoutineStatus(routine);
        }
    });
    saveRoutinesToLocalStorage();
}

// ==================== RENDER ROUTINE CARDS ====================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTimeDisplay(time) {
    if (!time) return 'Любое время';
    const [hour, minute] = time.split(':');
    return `${hour.padStart(2, '0')}:${minute}`;
}

function getStatusText(status) {
    const statusMap = {
        'upcoming': 'Предстоящий',
        'active': 'Активный',
        'missed': 'Просроченный',
        'completed': 'Выполненный',
        'skipped': 'Пропущен'
    };
    return statusMap[status] || status;
}

function renderRoutines() {
    const container = document.getElementById('routinesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    updateAllRoutineStatuses();
    
    const today = new Date().getDay();
    
    const todaysRoutines = routines.filter(r => r.repeatDays.includes(today) && r.status !== 'skipped');
    const skippedRoutines = routines.filter(r => r.status === 'skipped');
    const otherRoutines = routines.filter(r => !r.repeatDays.includes(today) && r.status !== 'skipped');
    
    if (todaysRoutines.length > 0) {
        const todaySection = createSection('📅 Сегодня', todaysRoutines.length);
        container.appendChild(todaySection);
        const todayList = todaySection.querySelector('.routines-list');
        todaysRoutines.forEach(r => todayList.appendChild(createRoutineCard(r)));
    }
    
    if (skippedRoutines.length > 0) {
        const skippedSection = createSection('⏭️ Пропущенные', skippedRoutines.length);
        container.appendChild(skippedSection);
        const skippedList = skippedSection.querySelector('.routines-list');
        skippedRoutines.forEach(r => skippedList.appendChild(createRoutineCard(r)));
    }
    
    if (otherRoutines.length > 0) {
        const otherSection = createSection('📚 Другие', otherRoutines.length);
        container.appendChild(otherSection);
        const otherList = otherSection.querySelector('.routines-list');
        otherRoutines.forEach(r => otherList.appendChild(createRoutineCard(r)));
    }
}

function createRoutineCard(routine) {
    const card = document.createElement('div');
    card.className = `routine-card ${routine.status === 'completed' ? 'completed' : ''}`;
    card.setAttribute('data-id', routine.id);
    
    let statusClass = '';
    let displayName = routine.name;
    let statusText = getStatusText(routine.status);
    
    switch (routine.status) {
        case 'upcoming': statusClass = 'status-upcoming'; break;
        case 'active': statusClass = 'status-active'; break;
        case 'missed': statusClass = 'status-missed'; break;
        case 'completed': statusClass = 'status-completed'; break;
        case 'skipped':
            statusClass = 'status-skipped';
            statusText = 'Пропущен';
            displayName = `${routine.name} (Пропущен)`;
            break;
    }
    
    const timeDisplay = routine.timeStart ? 
        `${formatTimeDisplay(routine.timeStart)}${routine.timeEnd ? ` - ${formatTimeDisplay(routine.timeEnd)}` : ''}` : 
        'Любое время';
    
    const showStartSkip = routine.status !== 'completed' && routine.status !== 'skipped';
    const showReopen = routine.status === 'completed' || routine.status === 'skipped';
    
    let actionButtonsHtml = '';
    if (showStartSkip) {
        actionButtonsHtml = `
            <button class="start-btn" data-id="${routine.id}">▶ Старт</button>
            <button class="skip-btn" data-id="${routine.id}">⏭ Пропустить</button>
        `;
    }
    if (showReopen) {
        actionButtonsHtml += `
            <button class="reopen-btn" data-id="${routine.id}">🔄 Возобновить</button>
        `;
    }
    
    card.innerHTML = `
        <div class="routine-card-content" style="border-top-color: ${routine.color}">
            <div class="routine-card-header">
                <span class="routine-name">${escapeHtml(displayName)}</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="routine-time">⏰ ${escapeHtml(timeDisplay)}</div>
            <div class="routine-card-actions">
                <div class="action-buttons">
                    ${actionButtonsHtml}
                </div>
                <button class="edit-btn" data-id="${routine.id}">✏️ Ред.</button>
            </div>
        </div>
    `;
    
    if (showStartSkip) {
        const startBtn = card.querySelector('.start-btn');
        const skipBtn = card.querySelector('.skip-btn');
        if (startBtn) startBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startRoutine(routine.id);
        });
        if (skipBtn) skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSkipConfirmation(routine.id);
        });
    }
    
    if (showReopen) {
        const reopenBtn = card.querySelector('.reopen-btn');
        if (reopenBtn) reopenBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            routine.status = 'upcoming';
            if (typeof window.saveRoutinesToLocalStorage === 'function') window.saveRoutinesToLocalStorage();
            if (typeof window.renderRoutines === 'function') window.renderRoutines();
        });
    }
    
    const editBtn = card.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(routine.id);
        });
    }
    
    return card;
}

// ==================== START ROUTINE - STEP PROGRESSION ====================

let currentProgressRoutine = null;
let currentStepIndex = 0;
let completedSteps = [];
let skippedSteps = [];

function startRoutine(routineId) {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    currentProgressRoutine = JSON.parse(JSON.stringify(routine));
    currentStepIndex = 0;
    completedSteps = [];
    skippedSteps = [];
    
    currentProgressRoutine.sortedSteps = [...currentProgressRoutine.steps].sort((a, b) => a.order - b.order);
    
    openProgressModal();
    renderCurrentStep();
}

function openProgressModal() {
    document.getElementById('progressOverlay').classList.add('active');
    document.getElementById('progressContainer').classList.add('active');
    document.getElementById('progressRoutineName').textContent = currentProgressRoutine.name;
    document.body.style.overflow = 'hidden';
}

function closeProgressModal() {
    document.getElementById('progressOverlay').classList.remove('active');
    document.getElementById('progressContainer').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCurrentStep() {
    const steps = currentProgressRoutine.sortedSteps;
    const totalSteps = steps.length;
    
    document.getElementById('stepCounter').textContent = `Шаг ${currentStepIndex + 1} из ${totalSteps}`;
    document.getElementById('stepName').textContent = steps[currentStepIndex].name;
    
    const beadsContainer = document.getElementById('beadsContainer');
    beadsContainer.innerHTML = '';
    
    steps.forEach((_, idx) => {
        const bead = document.createElement('div');
        bead.className = 'bead';
        if (idx < currentStepIndex) bead.classList.add('completed');
        else if (idx === currentStepIndex) bead.classList.add('current');
        else bead.classList.add('upcoming');
        beadsContainer.appendChild(bead);
    });
}

function completeCurrentStep() {
    completedSteps.push(currentProgressRoutine.sortedSteps[currentStepIndex]);
    moveToNextStep();
    saveRoutinesToLocalStorage();
}

function skipCurrentStep() {
    skippedSteps.push(currentProgressRoutine.sortedSteps[currentStepIndex]);
    moveToNextStep();
    saveRoutinesToLocalStorage();
}

function moveToNextStep() {
    currentStepIndex++;
    
    if (currentStepIndex < currentProgressRoutine.sortedSteps.length) {
        renderCurrentStep();
    } else {
        closeProgressModal();
        showCompletionSummary();
        
        const routine = routines.find(r => r.id === currentProgressRoutine.id);
        if (routine) {
            routine.status = 'completed';
            saveRoutinesToLocalStorage();
            renderRoutines();
        }
    }
}

// ==================== COMPLETION SUMMARY ====================

function showCompletionSummary() {    
    document.getElementById('completionRoutineName').textContent = currentProgressRoutine.name;
    document.getElementById('completionStats').textContent = `${completedSteps.length} выполнено, ${skippedSteps.length} пропущено`;
    
    document.getElementById('completionOverlay').classList.add('active');
    document.getElementById('completionContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCompletionSummary() {
    document.getElementById('completionOverlay').classList.remove('active');
    document.getElementById('completionContainer').classList.remove('active');
    document.body.style.overflow = '';
}

// ==================== SKIP ROUTINE CONFIRMATION ====================

let routineToSkip = null;

function showSkipConfirmation(routineId) {
    routineToSkip = routines.find(r => r.id === routineId);
    if (!routineToSkip) return;
    
    document.getElementById('skipRoutineName').textContent = routineToSkip.name;
    document.getElementById('skipOverlay').classList.add('active');
    document.getElementById('skipContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSkipConfirmation() {
    document.getElementById('skipOverlay').classList.remove('active');
    document.getElementById('skipContainer').classList.remove('active');
    document.body.style.overflow = '';
    routineToSkip = null;
}

function confirmSkipRoutine() {
    if (routineToSkip) {
        routineToSkip.status = 'skipped';
        saveRoutinesToLocalStorage();
        renderRoutines();
    }
    closeSkipConfirmation();
}

// ==================== EDIT ROUTINE WITH DELETE ====================

function openEditModal(routineId) {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    const modalBody = document.querySelector('.modal-body');
    let deleteBtn = document.getElementById('deleteRoutineBtn');
    if (!deleteBtn) {
        deleteBtn = document.createElement('button');
        deleteBtn.id = 'deleteRoutineBtn';
        deleteBtn.className = 'delete-routine-btn';
        deleteBtn.textContent = 'УДАЛИТЬ РАСПОРЯДОК';
        deleteBtn.onclick = () => showDeleteConfirmation(routine.id);
        modalBody.appendChild(deleteBtn);
    } else {
        deleteBtn.onclick = () => showDeleteConfirmation(routine.id);
        deleteBtn.style.display = 'block';
    }
    
    if (typeof window.openModalWithData === 'function') {
        window.openModalWithData(routine);
    }
}

// Delete confirmation variables
let routineToDelete = null;

function showDeleteConfirmation(routineId) {
    routineToDelete = routines.find(r => r.id === routineId);
    if (!routineToDelete) return;
    document.getElementById('deleteRoutineName').textContent = routineToDelete.name;
    document.getElementById('deleteOverlay').classList.add('active');
    document.getElementById('deleteContainer').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDeleteConfirmation() {
    document.getElementById('deleteOverlay').classList.remove('active');
    document.getElementById('deleteContainer').classList.remove('active');
    document.body.style.overflow = '';
    routineToDelete = null;
}

function confirmDeleteRoutine() {
    if (routineToDelete) {
        routines = routines.filter(r => r.id !== routineToDelete.id);
        saveRoutinesToLocalStorage();
        renderRoutines();
        closeModal();
    }
    closeDeleteConfirmation();
}

const originalCloseModal = closeModal;
window.closeModal = function() {
    const deleteBtn = document.getElementById('deleteRoutineBtn');
    if (deleteBtn) deleteBtn.style.display = 'none';
    originalCloseModal();
};

function closeModal() {
    if (typeof window.closeModal === 'function') {
        window.closeModal();
    } else {
        console.warn('closeModal not available yet');
    }
}

// ==================== MENU FUNCTIONALITY ====================

const sidebar = document.getElementById('sidebar');
const menuOverlay = document.getElementById('menuOverlay');
const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');

function openMenu() {
    sidebar.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    sidebar.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            window.location.href = href;
        }
        closeMenu();
    });
});

// ==================== GREETING & DATE/TIME ====================

function updateGreetingAndDate() {
    const now = new Date();
    const hour = now.getHours();
    const greetingText = document.getElementById('greetingText');
    const userNameSpan = document.getElementById('userName');
    const dateTimeElement = document.getElementById('currentDateTime');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    let greeting = '';
    if (hour < 12) greeting = 'Доброе утро, ☀️';
    else if (hour < 18) greeting = 'Добрый день, 🌤️';
    else greeting = 'Добрый вечер, 🌙';
    greetingText.textContent = greeting;
    
    const userName = user.name && user.name.trim() !== '' ? user.name : 'Друг';
    userNameSpan.textContent = userName;

    
    const datetimeOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    dateTimeElement.textContent = now.toLocaleString('ru-RU', datetimeOptions);
}

function updateTime() {
    const now = new Date();
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        const datetimeOptions = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeElement.textContent = now.toLocaleString('ru-RU', datetimeOptions);
    }
}

function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

function redirectToLogin() {
    window.location.href = 'login.html';
}

// ==================== INITIALIZATION ====================

function init() {
    // Аутентификация временно отключена для разработки
    // const publicPages = ['login.html', 'signup.html'];
    // const currentPage = window.location.pathname.split('/').pop();
    // if (!publicPages.includes(currentPage) && !isAuthenticated()) {
    //     redirectToLogin();
    //     return;
    // }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.name && document.getElementById('userName')) {
        document.getElementById('userName').textContent = user.name;
    }

    loadRoutinesFromLocalStorage();
    renderRoutines();
    updateGreetingAndDate();
    
    setInterval(() => {
        updateTime();
        updateAllRoutineStatuses();
        renderRoutines();
    }, 60000);
    
    if (!localStorage.getItem('hasLaunched')) {
        console.log('Первый запуск!');
        localStorage.setItem('hasLaunched', 'true');
    }    
}

document.addEventListener('DOMContentLoaded', init);

// ==================== SERVICE WORKER REGISTRATION ====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// ==================== MODAL EVENT LISTENERS ====================

document.getElementById('completeStepBtn').addEventListener('click', completeCurrentStep);
document.getElementById('skipStepBtn').addEventListener('click', skipCurrentStep);
document.getElementById('closeProgressBtn').addEventListener('click', closeProgressModal);
document.getElementById('progressOverlay').addEventListener('click', closeProgressModal);

document.getElementById('cancelSkipBtn').addEventListener('click', closeSkipConfirmation);
document.getElementById('confirmSkipBtn').addEventListener('click', confirmSkipRoutine);
document.getElementById('skipOverlay').addEventListener('click', closeSkipConfirmation);

document.getElementById('cancelDeleteBtn').addEventListener('click', closeDeleteConfirmation);
document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDeleteRoutine);
document.getElementById('deleteOverlay').addEventListener('click', closeDeleteConfirmation);

document.getElementById('closeCompletionBtn').addEventListener('click', closeCompletionSummary);
document.getElementById('completionOverlay').addEventListener('click', closeCompletionSummary);