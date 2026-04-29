// Estilos generales
import '../../css/style.css'
import '../../css/pages/suppliers.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/suppliers/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { addSupplier } from '../components/suppliers/suppliers-form.js';
import { renderStaffList } from '../components/suppliers/staff-list.js';
import { renderSuppliersList } from '../components/suppliers/suppliers-list.js';
import { suppliersFilter } from '../components/suppliers/suppliers-filter.js';
import { renderSuppliersEditModal } from '../components/suppliers/suppliers-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    renderStaffList()
    renderSuppliersList()
});

// Declarar el botón de filtrado
document.getElementById("filter-btn").addEventListener('click', async function() {
    suppliersFilter();
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addSupplier(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const supplierData = JSON.parse(button.getAttribute('supplier-data'));
    renderSuppliersEditModal(supplierData);
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
