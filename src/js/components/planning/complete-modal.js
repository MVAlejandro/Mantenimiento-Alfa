// Servicios supabase
import { getOrderSpares, getSpares, updateOrderSpares } from "../../services/spares-service";
import { updateFullTasks } from "../../services/calendar-service";
// Utilidades
import { loadOptionsFilter } from "../../utils/load-select";
import { inputValidate, selectValidate, textValidate } from "../../utils/form-validations";
import { planningCalendar } from "./planning-calendar";

// Función para agregar campos de productos con select
export async function selectProductRow(selectedSpareId = '0', quantityValue = '') {
    const container = document.getElementById('task-spares-container');
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `spare-${index}`;

    const newSpare = document.createElement("div");
    newSpare.className = `row ms-2 me-2 pt-2 pb-2 spare-item`;
    newSpare.innerHTML =
        `<div class="col-6">
            <select class="form-select spare-select" id="${uniqueId}-select" data-index="${index}">
                <option value="0">Seleccionar producto</option>
            </select>
        </div>
        <div class="col-4">
            <input type="number" id="${uniqueId}-quantity" class="form-control spare-select-quantity" placeholder="Cantidad" data-index="${index}" value="${quantityValue}">
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
            <button type="button" class="btn btn-delete" data-index="${index}">X</button>
        </div>`;

    container.appendChild(newSpare);

    // Cargar opciones en el select
    await loadOptionsFilter(`${uniqueId}-select`, getSpares, 'id_refaccion', ['codigo', 'nombre'], "Seleccione Refacción...", selectedSpareId);
}

// Función para cargar datos en el modal
export async function renderCompleteTaskModal(tarea) {
    const modal = document.getElementById('complete-modal');
    // Insertar valores en los inputs
    document.getElementById('hidden-id-task').value = tarea.id_orden_trabajo;
    document.getElementById('complete-date').value = tarea.fecha_realizada;
    document.getElementById('complete-status').value = tarea.estado;
    document.getElementById('complete-observations').value = tarea.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("task-spares-container");
    container.innerHTML = '';

    // Obtener refacciones de la tarea
    const refacciones = await getOrderSpares(tarea.id_orden_trabajo);

    // Agregar una fila por cada refacción
    for (const spare of refacciones) {
        await selectProductRow(spare.id_refaccion, spare.cantidad);
    }

    if (tarea.estado !== "Pendiente") {
        modal.querySelectorAll('input, select, textarea, .btn-primary').forEach(e => {
            e.disabled = true;
        });
    }
}

// Agregar entrada de refacción
document.getElementById('btn-add-spare').addEventListener('click', () => {
    selectProductRow();
});

// Eliminar entrada de producto
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-remove')) {
        e.target.closest('.orderProduct-item').remove();
    }
});

// Función para guardar cambios
document.getElementById('btn-complete-task').addEventListener('click', async function() {
    const form = document.getElementById('tasks-complete-form');
    // Referencias para validación
    const fecha_realizadaIn = document.getElementById('complete-date');
    const estadoIn = document.getElementById('complete-status');
    const observacionesIn = document.getElementById('complete-observations');

    const fecha_realizadaError = document.getElementById('error-completeDate');
    const estadoError = document.getElementById('error-completeStatus');
    const observacionesError = document.getElementById('error-completeObservations');

    // Validaciones
    textValidate(fecha_realizadaIn, fecha_realizadaError)
    selectValidate(estadoIn, estadoError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    const id_orden_trabajo = document.getElementById('hidden-id-task').value;
    const updatedData = { 
        fecha_realizada: fecha_realizadaIn.value,
        estado: estadoIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updateFullTasks(id_orden_trabajo, updatedData);
        await updateOrderSpares(id_orden_trabajo);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('complete-modal')).hide();
        Swal.fire({
            title: 'Orden de trabajo actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await planningCalendar();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la orden de trabajo',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});