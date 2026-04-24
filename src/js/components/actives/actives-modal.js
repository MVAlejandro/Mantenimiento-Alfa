import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateActive, deleteActive } from '../../services/actives-service.js'; 
import { renderActivesTable } from './actives-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderActivesEditModal(activo) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-active').value = activo.id_activo;
    document.getElementById('edit-code').value = activo.codigo;
    document.getElementById('edit-staff').value = activo.encargado;
    document.getElementById('edit-departament').value = activo.departamento;
    document.getElementById('edit-name').value = activo.nombre;
    document.getElementById('edit-model').value = activo.modelo;
    document.getElementById('edit-year').value = activo.anio;
    document.getElementById('edit-description').value = activo.descripcion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('actives-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const modeloIn = document.getElementById('edit-model');
    const anioIn = document.getElementById('edit-year');
    const descripcionIn = document.getElementById('edit-description');

    const nombreError = document.getElementById('error-editName');
    const modeloError = document.getElementById('error-editModel');
    const anioError = document.getElementById('error-editYear');
    const descripcionError = document.getElementById('error-editDescription');

    // Validaciones
    textValidate(nombreIn, nombreError)
    textValidate(modeloIn, modeloError)
    textValidate(anioIn, anioError)
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

    const id_activo = document.getElementById('edit-id-active').value;
    const updatedData = {
        nombre: nombreIn.value,
        modelo: modeloIn.value,
        anio: anioIn.value,
        descripcion: descripcionIn.value
    };

    try {
        await updateActive(id_activo, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Activo actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderActivesTable();
    } catch (err) {
        console.error('Error al actualizar activo:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el activo.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idactive = document.getElementById('delete-id-active').value;
    await deleteActive(idactive);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    Swal.fire({
        title: 'activo eliminado correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await renderActivesTable();
});