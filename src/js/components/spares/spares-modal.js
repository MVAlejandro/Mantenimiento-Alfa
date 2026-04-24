import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateSpare, deleteSpare } from '../../services/spares-service.js'; 
import { renderSparesTable } from './spares-table.js'; 
// Utilidades
import { textValidate, amountValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderSparesEditModal(refaccion) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-spare').value = refaccion.id_refaccion;
    document.getElementById('edit-code').value = refaccion.codigo;
    document.getElementById('edit-name').value = refaccion.nombre;
    document.getElementById('edit-unit').value = refaccion.unidad_medida;
    document.getElementById('edit-cost').value = refaccion.costo_unitario;
    document.getElementById('edit-description').value = refaccion.descripcion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('spares-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const unidad_medidaIn = document.getElementById('edit-unit');
    const costo_unitarioIn = document.getElementById('edit-cost');
    const descripcionIn = document.getElementById('edit-description');

    const nombreError = document.getElementById('error-editName');
    const unidad_medidaError = document.getElementById('error-editUnit');
    const costo_unitarioError = document.getElementById('error-editCost');
    const descripcionError = document.getElementById('error-editDescription');

    // Validaciones
    textValidate(nombreIn, nombreError)
    textValidate(unidad_medidaIn, unidad_medidaError)
    amountValidate(costo_unitarioIn, costo_unitarioError)
    textValidate(descripcionIn, descripcionError)

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

    const id_refaccion = document.getElementById('edit-id-spare').value;
    const updatedData = {
        nombre: nombreIn.value,
        unidad_medida: unidad_medidaIn.value,
        costo_unitario: costo_unitarioIn.value,
        descripcion: descripcionIn.value
    };

    try {
        await updateSpare(id_refaccion, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Refacción actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderSparesTable();
    } catch (err) {
        console.error('Error al actualizar refaccion:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la refacción.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idSpare = document.getElementById('delete-id-spare').value;
    await deleteSpare(idSpare);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    Swal.fire({
        title: 'Refacción eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await renderSparesTable();
});