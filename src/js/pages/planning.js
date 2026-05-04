// Estilos generales
import '../../css/style.css'
import '../../css/pages/planning.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { planningCalendar } from '../components/planning/planning-calendar.js';
import { renderCompleteTaskModal } from '../components/planning/complete-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage();
    planningCalendar();
});

// Acciones del modal de gestión de tarea
const completeModal = document.getElementById('complete-modal');
// Al abrir modal
completeModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const taskData = JSON.parse(button.getAttribute('task-data'));

    renderCompleteTaskModal(taskData);
});
// Al cerrar modal
completeModal.addEventListener('hidden.bs.modal', () => {
    completeModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    completeModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});
