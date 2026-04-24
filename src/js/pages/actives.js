// Estilos generales
import '../../css/style.css'
import '../../css/pages/actives.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/actives/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { addActive } from '../components/actives/actives-form.js';
import { renderActivesTable } from '../components/actives/actives-table.js';
import { activesFilter } from '../components/actives/actives-filter.js';
import { renderActivesEditModal } from '../components/actives/actives-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    renderActivesTable()
});

// Declarar el botón de filtrado
document.getElementById("filter-btn").addEventListener('click', async function() {
    activesFilter();
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addActive(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const activeData = JSON.parse(button.getAttribute('active-data'));
    renderActivesEditModal(activeData);
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
    const idActive = button.dataset.id;
    document.getElementById('delete-id-active').value = idActive;
});
// Limpiar información al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-active').value = '';
});