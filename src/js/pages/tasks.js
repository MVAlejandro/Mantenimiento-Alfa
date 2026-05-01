// Estilos generales
import '../../css/style.css'
import '../../css/pages/tasks.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/tasks/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { addTask } from '../components/tasks/tasks-form.js';
import { renderTasksTable } from '../components/tasks/tasks-table.js';
import { renderTasksEditModal } from '../components/tasks/tasks-modal.js';
import { tasksFilter } from '../components/tasks/tasks-filter.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage();
    renderTasksTable();
});

// Declarar el botón de filtrado
document.getElementById("filter-btn").addEventListener('click', async function() {
    tasksFilter();
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addTask(e);
    }
});

// Acciones del modal de asignación
const asignModal = document.getElementById('asign-modal');
// Al abrir modal
asignModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const idTask = button.dataset.id;
    document.getElementById('asign-id-task').value = idTask;
});
// Al cerrar modal
asignModal.addEventListener('hidden.bs.modal', () => {
    asignModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    asignModal.querySelectorAll('input').forEach(el => {
        el.value = '';
    });
    asignModal.querySelectorAll('select').forEach(el => {
        el.value = '0';
    });
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const taskData = JSON.parse(button.getAttribute('task-data'));
    renderTasksEditModal(taskData);
});
// Al cerrar modal
editModal.addEventListener('hidden.bs.modal', () => {
    editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    editModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Acciones del modal de eliminación
const deleteModal = document.getElementById('delete-modal');
// Al abrir modal
deleteModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const idTask = button.dataset.id;
    document.getElementById('delete-id-task').value = idTask;
});
// Limpiar información al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-task').value = '';
});