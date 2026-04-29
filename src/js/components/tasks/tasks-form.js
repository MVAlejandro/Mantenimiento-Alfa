import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createTask } from '../../services/tasks-service.js'; 
import { renderTasksTable } from './tasks-table.js';
// Utilidades
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para agregar un activo mediante ek formulario
export async function addTask(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('task-form');
    // Referencias para validación
    const nombreIn = document.getElementById("name");
    const id_activoIn = document.getElementById("active");
    const sistemaIn = document.getElementById("system");
    const id_periodicidadIn = document.getElementById("periodicity");
    const prioridadIn = document.getElementById("priority");
    const descripcionIn = document.getElementById("description");
    // Referencias para errores
    const nombreError = document.getElementById('error-name');
    const id_activoError = document.getElementById('error-active');
    const sistemaError = document.getElementById('error-system');
    const id_periodicidadError = document.getElementById('error-periodicity');
    const prioridadError = document.getElementById('error-priority');
    const descripcionError = document.getElementById('error-description');

    // Validaciones
    textValidate(nombreIn, nombreError)
    selectValidate(id_activoIn, id_activoError)
    textValidate(sistemaIn, sistemaError)
    selectValidate(id_periodicidadIn, id_periodicidadError)
    selectValidate(prioridadIn, prioridadError)
    textValidate(descripcionIn, descripcionError)

    const campos = form.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
        return
    }

    // Guardar valores
    const newTaskData = {
        nombre: nombreIn.value,
        id_activo: id_activoIn.value,
        sistema: sistemaIn.value,
        id_periodicidad: id_periodicidadIn.value,
        prioridad: prioridadIn.value,
        descripcion: descripcionIn.value
    };

    try {
        await createTask(newTaskData);
        Swal.fire({
            title: 'Tarea agregada con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        await renderTasksTable();

    } catch (err) {
        console.error('Error al agregar tarea:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al generar la tarea.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
    }
}
