import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateSupplier, deleteSupplier } from '../../services/suppliers-service.js'; 
import { renderSuppliersList } from './suppliers-list.js'; 
// Utilidades
import { nameValidate, textValidate, emailValidate, phoneValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderSuppliersEditModal(proveedor) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-supplier').value = proveedor.id_proveedor;
    document.getElementById('edit-name').value = proveedor.nombre;
    document.getElementById('edit-company').value = proveedor.empresa;
    document.getElementById('edit-phone').value = proveedor.telefono;
    document.getElementById('edit-email').value = proveedor.correo;
    document.getElementById('edit-location').value = proveedor.direccion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('suppliers-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const empresaIn = document.getElementById('edit-company');
    const direccionIn = document.getElementById('edit-location');
    const telefonoIn = document.getElementById('edit-phone');
    const correoIn = document.getElementById('edit-email');

    const nombreError = document.getElementById('error-editName');
    const empresaError = document.getElementById('error-editCompany');
    const direccionError = document.getElementById('error-editLocation');
    const telefonoError = document.getElementById('error-editPhone');
    const correoError = document.getElementById('error-editEmail');

    // Validaciones
    nameValidate(nombreIn, nombreError)
    textValidate(empresaIn, empresaError)
    textValidate(direccionIn, direccionError)
    phoneValidate(telefonoIn, telefonoError)
    emailValidate(correoIn, correoError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    const id_proveedor = document.getElementById('edit-id-supplier').value;
    const updatedData = {
        nombre: nombreIn.value,
        empresa: empresaIn.value,
        direccion: direccionIn.value,
        telefono: telefonoIn.value,
        correo: correoIn.value
    };

    try {
        await updateSupplier(id_proveedor, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Proveedor actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderSuppliersList();
    } catch (err) {
        console.error('Error al actualizar proveedor:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el proveedor.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
