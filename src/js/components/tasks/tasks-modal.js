import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getActives } from '../../services/actives-service.js';
import { updateTask, deleteTask, getPeriodicity } from '../../services/tasks-service.js'; 
import { asignTask } from '../../services/tasks-asign-service.js';
import { renderTasksTable } from './tasks-table.js'; 
// Utilidades
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';
import { loadOptions, loadOptionsFilter } from '../../utils/load-select.js';

// Función para cargar datos en el modal
export async function renderTasksEditModal(tarea) {
    // Cargar los selects en el modal
    loadOptionsFilter('edit-active', getActives, 'id_activo', 'nombre', 'Seleccione...', tarea.id_activo);
    loadOptionsFilter('edit-periodicity', getPeriodicity, 'id_periodicidad', 'nombre', 'Seleccione...', tarea.id_periodicidad);

    // Insertar valores en los inputs
    document.getElementById('edit-id-task').value = tarea.id_tarea;
    document.getElementById('edit-name').value = tarea.nombre;
    document.getElementById('edit-periodicity').value = tarea.id_periodicidad;
    document.getElementById('edit-active').value = tarea.id_activo;
    document.getElementById('edit-system').value = tarea.sistema;
    document.getElementById('edit-priority').value = tarea.prioridad;
    document.getElementById('edit-description').value = tarea.descripcion;
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

    const id_tarea = document.getElementById('edit-id-active').value;
    const updatedData = {
        nombre: nombreIn.value,
        modelo: modeloIn.value,
        anio: anioIn.value,
        descripcion: descripcionIn.value
    };

    try {
        await updateTask(id_tarea, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Tarea actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderTasksTable();
    } catch (err) {
        console.error('Error al actualizar tarea:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la tarea.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});

// Función para asignar la tarea a un proveedor o empleado
document.getElementById('btn-asign-entry').addEventListener('click', async () => {
    const idTask = document.getElementById('asign-id-task').value;
    
    await asignTask(idTask);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('asign-modal')).hide();
    Swal.fire({
        title: 'Tarea asignada correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await renderTasksTable();
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idTask = document.getElementById('delete-id-active').value;
    await deleteTask(idTask);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    Swal.fire({
        title: 'Tarea eliminada correctamente.',
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await renderTasksTable();
});