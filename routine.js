// ==================== routine.js - Add/Edit Routine Modal Logic ====================

// ==================== DOM ELEMENTS ====================

const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const modalTitle = document.getElementById('modalTitle');
const addRoutineBtn = document.getElementById('addRoutineBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const saveRoutineBtn = document.getElementById('saveRoutineBtn');

// Form fields
const routineNameInput = document.getElementById('routineName');
const routineColorInput = document.getElementById('routineColor');
const colorSwatches = document.querySelectorAll('.color-swatch');
const dayButtons = document.querySelectorAll('.day-btn');
const timeStartInput = document.getElementById('timeStart');
const timeEndInput = document.getElementById('timeEnd');
const descriptionInput = document.getElementById('routineDescription');

// ==================== MODAL CONTROL ====================

// null = adding new routine, otherwise editing
let editingRoutineId = null; 

function openModal(editMode = false, routineData = null) {
    if (editMode && routineData) {
        modalTitle.textContent = 'Редактировать Распорядок';
        editingRoutineId = routineData.id;
        fillFormWithRoutineData(routineData);
    } 
    else {
        modalTitle.textContent = 'Добавить Распорядок';
        editingRoutineId = null;
        resetForm();
        if (window.resetSteps) {
            window.resetSteps();
        }

    }
    
    modalOverlay.classList.add('active');
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(updateStepsUIReminder, 100);
}

// Expose for app.js to call with routine data
window.openModalWithData = function(routine) {
    openModal(true, routine);
};

function closeModal() {
    modalOverlay.classList.remove('active');
    modalContainer.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();

    // Remove delete button if exists   NOT SO SURE ABT THIS, IS THIS NECESSARY IDK
    const deleteBtn = document.getElementById('deleteRoutineBtn');
    if (deleteBtn) deleteBtn.remove();
}
window.closeModal = closeModal;


function resetForm() {
    routineNameInput.value = '';
    routineColorInput.value = '#4A90E2';
    timeStartInput.value = '';
    timeEndInput.value = '';
    descriptionInput.value = '';
    
    // Reset color swatches
    colorSwatches.forEach(swatch => {
        swatch.classList.remove('selected');
        if (swatch.dataset.color === '#E3F2FD') {
            swatch.classList.add('selected');
        }
    });
    
    // Reset day buttons
    dayButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Clear steps when resetting form
    if (window.resetSteps) {
        window.resetSteps();  // This clears the steps array
    }

}

function fillFormWithRoutineData(routine) {
    routineNameInput.value = routine.name || '';
    routineColorInput.value = routine.color || '#E3F2FD';
    timeStartInput.value = routine.timeStart || '';
    timeEndInput.value = routine.timeEnd || '';
    descriptionInput.value = routine.description || '';
    
    // Set color swatch
    colorSwatches.forEach(swatch => {
        swatch.classList.remove('selected');
        if (swatch.dataset.color === routine.color) {
            swatch.classList.add('selected');
        }
    });
    
    // Set repeat days
    const repeatDays = routine.repeatDays || [];
    dayButtons.forEach(btn => {
        const dayValue = parseInt(btn.dataset.day);
        if (repeatDays.includes(dayValue)) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
    
    // Set steps (will be handled by steps-drag-drop.js)
    if (window.setStepsData && routine.steps) {
        window.setStepsData(routine.steps);
    }
}

// ==================== COLOR PICKER ====================

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
        colorSwatches.forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
        routineColorInput.value = swatch.dataset.color;
    });
});

// ==================== REPEAT DAYS ====================

dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('selected');
    });
});

function getSelectedDays() {
    const selected = [];
    dayButtons.forEach(btn => {
        if (btn.classList.contains('selected')) {
            selected.push(parseInt(btn.dataset.day));
        }
    });
    return selected;
}

// ==================== FORM VALIDATION ====================

function validateForm() {
    const name = routineNameInput.value.trim();
    if (!name) {
        alert('Введите название распорядка');
        routineNameInput.focus();
        return false;
    }
    
    const selectedDays = getSelectedDays();
    if (selectedDays.length === 0) {
        alert('Выберите хотя бы один повторный день');
        return false;
    }
    
    // Check if steps are empty (using global function from steps-drag-drop.js)
    
    let currentSteps = [];
    if (window.getStepsData) {
        currentSteps = window.getStepsData();
    }

    if (!currentSteps || currentSteps.length === 0) {
        alert('❌ Добавьте хотя бы один шаг в свой распорядок дня');
        return false;
    }

    // Validate time format (optional fields)
    if (timeStartInput.value && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeStartInput.value)) {
        alert('Введите допустимое время начала в 24-часовом формате (ЧЧ:ММ)');
        timeStartInput.focus();
        return false;
    }
    
    if (timeEndInput.value && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(timeEndInput.value)) {
        alert('Введите допустимое время окончания в 24-часовом формате (ЧЧ:ММ)');
        timeEndInput.focus();
        return false;
    }
    return true;
}

// ==================== SAVE ROUTINE ====================

function saveRoutine() {
    if (!validateForm()) return;
    
    const stepsData = window.getStepsData ? window.getStepsData() : [];
    
    // Safer status extraction for edit mode
    let existingStatus = 'upcoming';
    if (editingRoutineId && window.routines && window.routines.length) {
        const existing = window.routines.find(r => r.id === editingRoutineId);
        if (existing && existing.status) existingStatus = existing.status;
    }

    // Safer createdAt extraction for edit mode
    let existingCreatedAt = new Date().toISOString();
    if (editingRoutineId && window.routines && window.routines.length) {
        const existing = window.routines.find(r => r.id === editingRoutineId);
        if (existing && existing.createdAt) existingCreatedAt = existing.createdAt;
    }
    const routineData = {
        id: editingRoutineId || Date.now(),
        name: routineNameInput.value.trim(),
        color: routineColorInput.value,
        repeatDays: getSelectedDays(),
        steps: stepsData,
        timeStart: timeStartInput.value || null,
        timeEnd: timeEndInput.value || null,
        description: descriptionInput.value.trim() || '',
        status: editingRoutineId ? existingStatus : 'upcoming',
        createdAt: editingRoutineId ? existingCreatedAt : new Date().toISOString()

    };
    
    if (editingRoutineId) {
        // Edit existing routine
        const index = window.routines.findIndex(r => r.id === editingRoutineId);
        if (index !== -1) {
            window.routines[index] = { ...window.routines[index], ...routineData };
        }
        editingRoutineId = null;
    } else {
        // Add new routine
        window.routines.push(routineData);
    }
    
    // Save to localStorage and re-render
    if (typeof window.saveRoutinesToLocalStorage === 'function') {
        window.saveRoutinesToLocalStorage();
    }
    if (typeof window.renderRoutines === 'function') {
        window.renderRoutines();
    } 
    closeModal();
}

// ==================== STEPS UI REMINDER ====================

// Helper function to show/hide steps reminder
function updateStepsUIReminder() {
    const stepsList = document.getElementById('stepsList');
    if (!stepsList) return;
    
    let currentSteps = window.getStepsData ? window.getStepsData() : [];
    const existingReminder = document.querySelector('.steps-reminder');
    
    if (currentSteps.length === 0) {
        if (!existingReminder) {
            const reminder = document.createElement('small');
            reminder.className = 'steps-reminder';
            reminder.style.display = 'block';
            reminder.style.marginTop = '8px';
            reminder.style.color = '#FF3B30';
            reminder.style.fontSize = '12px';
            reminder.innerHTML = '⚠️ Чтобы сохранить распорядок, необходим хотя бы один шаг';
            
            const formGroup = document.querySelector('.form-group:has(#stepsList)');
            if (formGroup) formGroup.appendChild(reminder);
        }
    } else {
        if (existingReminder) existingReminder.remove();
    }
}

// ==================== EVENT LISTENERS ====================

addRoutineBtn.addEventListener('click', () => openModal(false));
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
saveRoutineBtn.addEventListener('click', saveRoutine);

// Close modal when clicking overlay
modalOverlay.addEventListener('click', closeModal);

// Prevent closing when clicking inside modal
modalContainer.addEventListener('click', (e) => {
    e.stopPropagation();
});