// ==================== steps-drag-drop.js - Step Management ====================

// ==================== STATE ====================

let steps = [];
let nextStepId = 1;
let draggedItem = null;

// ==================== DOM ELEMENTS ====================

const stepsList = document.getElementById('stepsList');
const addStepBtn = document.getElementById('addStepBtn');

// ==================== HELPER FUNCTIONS ====================


function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


function getNextStepId() {
    return nextStepId++;
}

function renderStepsList() {
    if (!stepsList) return;
    stepsList.innerHTML = '';
    
    if (steps.length === 0) {
        // Show empty state message
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'step-item';
        emptyMsg.style.justifyContent = 'center';
        emptyMsg.style.color = '#999';
        emptyMsg.style.cursor = 'default';
        emptyMsg.innerHTML = '<span>Никаких шагов пока нет. Нажмите «+ Добавить шаг», чтобы добавить его.</span>';
        stepsList.appendChild(emptyMsg);
        return;
    }

    steps.forEach((step, index) => {
        const stepElement = document.createElement('div');
        stepElement.className = 'step-item';
        stepElement.setAttribute('data-id', step.id);
        stepElement.setAttribute('data-index', index);
        stepElement.draggable = true;
        
        // Create editable step name
        const stepNameSpan = document.createElement('span');
        stepNameSpan.className = 'step-name';
        stepNameSpan.textContent = step.name;
        stepNameSpan.contentEditable = 'true';
        stepNameSpan.addEventListener('blur', (e) => {
            const newName = e.target.textContent.trim();
            if (newName) {
                step.name = newName;
            } else {
                e.target.textContent = step.name; // revert
            }
        });
        stepNameSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                stepNameSpan.blur();
            }
        });
        
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.textContent = '☰';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-step';
        deleteBtn.textContent = '🗑️';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteStep(step.id);
        });
        
        stepElement.appendChild(dragHandle);
        stepElement.appendChild(stepNameSpan);
        stepElement.appendChild(deleteBtn);
        
        stepElement.addEventListener('dragstart', handleDragStart);
        stepElement.addEventListener('dragend', handleDragEnd);
        stepElement.addEventListener('dragover', handleDragOver);
        stepElement.addEventListener('drop', handleDrop);
        
        stepsList.appendChild(stepElement);
    });
}


// ==================== DRAG & DROP ====================

function handleDragStart(e) {
    draggedItem = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragEnd(e) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    if (!draggedItem || draggedItem === this) return;
    const draggedIndex = parseInt(draggedItem.dataset.index);
    const targetIndex = parseInt(this.dataset.index);
    if (isNaN(draggedIndex) || isNaN(targetIndex)) return;
    const [removed] = steps.splice(draggedIndex, 1);
    steps.splice(targetIndex, 0, removed);
    steps.forEach((step, idx) => step.order = idx);
    renderStepsList();
}


// ==================== STEP CRUD OPERATIONS ====================

function addStep() {
    const newStep = {
        id: getNextStepId(),
        name: 'New step',
        order: steps.length
    };
    steps.push(newStep);
    renderStepsList();
    // Auto-focus the new editable step
    setTimeout(() => {
        const lastStep = stepsList.querySelector('.step-item:last-child .step-name');
        if (lastStep) lastStep.focus();
    }, 50);
}

function deleteStep(id) {
    steps = steps.filter(step => step.id !== id);
    // Reorder remaining steps
    steps.forEach((step, idx) => step.order = idx);
    renderStepsList();
}

function getStepsData() {
    return steps.map(step => ({
        id: step.id,
        name: step.name,
        order: step.order
    }));
}

function setStepsData(stepsData) {
    if (stepsData && stepsData.length) {
        steps = stepsData.map(step => ({
            id: step.id,
            name: step.name,
            order: step.order
        }));
        nextStepId = Math.max(...steps.map(s => s.id), 0) + 1;
    } else {
        steps = [];
        nextStepId = 1;
    }
    renderStepsList();
}

function resetSteps() {
    steps = [];
    nextStepId = 1;
    renderStepsList();
}

// ==================== EVENT LISTENERS ====================

if (addStepBtn) {
    addStepBtn.addEventListener('click', addStep);
}

// ==================== EXPOSE FUNCTIONS FOR OTHER FILES ====================

window.getStepsData = getStepsData;
window.setStepsData = setStepsData;
window.resetSteps = resetSteps;