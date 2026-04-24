// Estilos generales
import '../../css/style.css'
import '../../css/pages/spares.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/spares/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { addSpare } from '../components/spares/spares-form.js';
import { renderSparesTable } from '../components/spares/spares-table.js';
import { sparesFilter } from '../components/spares/spares-filter.js';
import { renderSparesEditModal } from '../components/spares/spares-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    renderSparesTable()
});

// Declarar el botón de filtrado
document.getElementById("filter-btn").addEventListener('click', async function() {
    sparesFilter();
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addSpare(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const spareData = JSON.parse(button.getAttribute('spare-data'));
    renderSparesEditModal(spareData);
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
    document.getElementById('delete-id-spare').value = idActive;
});
// Limpiar información al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-spare').value = '';
});