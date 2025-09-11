
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import {validarCamposInvalidos, validarSelect} from "../js/validaciones/validar_campos.js"
import {validarText} from "./validaciones/regex.js"

// Función para cargar datos en select
async function cargarOpciones(selectId, tabla, valueKey, textKey) {
    const select = document.getElementById(selectId)
    if (!select) return

    const { data, error } = await supabase.from(tabla).select(`${valueKey}, ${textKey}`)

    select.innerHTML = '<option value="0">Seleccione...</option>'

    if (error) {
        console.error(`Error cargando ${tabla}:`, error)
        return
    }

    data.forEach(item => {
        const option = document.createElement('option')
        option.value = item[valueKey]
        option.textContent = item[textKey]
        select.appendChild(option)
    })
}

// Función para insertar una nueva tarea en Supabase
async function insertarTarea(tarea) {
    const { data, error } = await supabase.from('tareas').insert([tarea])

    if (error) {
        console.error(error)
        alert('Error al guardar la tarea: ' + error.message)
    } else {
        alert('Tarea agregada con éxito')
        cargarTareas() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función para cargar las tareas desde Supabase
async function cargarTareas() {
    const desglose = document.getElementById("desglose");
    desglose.innerHTML = "";

    // Traer tareas con joins para mostrar nombres en lugar de IDs
    const { data, error } = await supabase
        .from("tareas")
        .select(`
            id_tarea,
            nombre,
            descripcion,
            unidades (nombre),
            sistemas (tipo),
            periodicidad (nombre)
        `);

    if (error) {
        console.error("Error al cargar tareas:", error);
        desglose.innerHTML = "<p>Error al cargar las tareas.</p>";
        return;
    }

    if (!data || data.length === 0) {
        desglose.innerHTML = "<p>No hay tareas registradas.</p>";
        return;
    }

    data.forEach(tarea => {
        const tareaHTML = `
        <div class="card mb-3">
            <div class="card-header">
                <strong>ID:</strong> ${tarea.id_tarea}
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${tarea.nombre}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Unidad:</strong> ${tarea.unidades?.nombre || "Sin unidad"}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Sistema:</strong> ${tarea.sistemas?.tipo || "Sin sistema"}</p>
                    </div>
                </div>
                <p class="info"><strong>Periodicidad:</strong> ${tarea.periodicidad?.nombre || "Sin periodicidad"}</p>
                <p class="info"><strong>Descripción:</strong> ${tarea.descripcion}</p>
                <div class="btn-wrapper d-flex justify-content-end align-items-end mt-4">
                    <button id="#" type="button" class="btn btn-modal" data-bs-toggle="modal" data-bs-target="#asignacion_modal" data-idtarea="${tarea.id_tarea}">Asignar tarea</button>
                </div>
            </div>
        </div>`;
        desglose.innerHTML += tareaHTML;

        // Abrir modal y pasar el id_tarea
        const asignacionModal = document.getElementById('asignacion_modal');
        asignacionModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget; // botón que abrió el modal
            const idTarea = button.getAttribute('data-idtarea');
            asignacionModal.dataset.idTarea = idTarea; // guardar temporalmente
        });
    });
}

// Cargar proveedores para mostrar en modal
async function cargarProveedores() {
    const { data: proveedores, error } = await supabase
        .from('proveedores')
        .select('id_proveedor, nombre');

    const select = document.getElementById('responsable');
    select.innerHTML = '<option value="0">Seleccione...</option>';

    if (error) {
        console.error('Error al cargar proveedores:', error);
        return;
    }

    proveedores.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id_proveedor;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

// Evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const nombre = document.getElementById('nombre_t').value;
    const id_unidad = document.getElementById('unidad').value;
    const id_sistema = document.getElementById('sistema').value;
    const id_periodicidad = document.getElementById('periodicidad').value;
    const descripcion = document.getElementById('descripcion').value;

    // Referencias para validación
    const nombreIn = document.getElementById('nombre_t');
    const id_unidadIn = document.getElementById('unidad');
    const id_sistemaIn = document.getElementById('sistema');
    const id_periodicidadIn = document.getElementById('periodicidad');
    const descripcionIn = document.getElementById('descripcion');

    const error_nombre = document.getElementById('error-nombre');
    const error_unidad = document.getElementById('error-unidad');
    const error_sistema = document.getElementById('error-sistema');
    const error_periodicidad = document.getElementById('error-periodicidad');
    const error_descripcion = document.getElementById('error-descripcion');

    // Validaciones
    validarText(nombreIn, error_nombre);
    validarSelect(id_unidadIn, error_unidad)
    validarSelect(id_sistemaIn, error_sistema)
    validarSelect(id_periodicidadIn, error_periodicidad)
    validarText(descripcionIn, error_descripcion);

    if (!nombre || !id_unidad || !id_sistema || !id_periodicidad || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    // Insertar en Supabase
    const nuevaTarea = {nombre, id_unidad, id_sistema, id_periodicidad, descripcion};
    await insertarTarea(nuevaTarea)
})

// Evento al dar click al botón Asignar
document.getElementById('btn_asignar').addEventListener('click', async () => {
    const asignacionModal = document.getElementById('asignacion_modal');
    const idTarea = asignacionModal.dataset.idTarea;

    const proveedor = document.getElementById('responsable').value;
    const fechaProgramada = document.getElementById('fecha_programada').value;

    if (!proveedor || proveedor === "0") {
        alert('Seleccione un responsable.');
        return;
    }

    if (!fechaProgramada) {
        alert('Ingrese una fecha programada.');
        return;
    }

    // Insertar en tarea_proveedor
    const { error: errorTP } = await supabase
        .from('tarea_proveedor')
        .insert([{ id_tarea: idTarea, id_proveedor: proveedor }]);

    if (errorTP) {
        console.error('Error al insertar en tarea_proveedor:', errorTP);
        alert('No se pudo asignar la tarea.');
        return;
    }

    // Insertar en calendario con estado Pendiente
    const { error: errorCal } = await supabase
        .from('calendario')
        .insert([{ id_tarea: idTarea, fecha_programada: fechaProgramada }]);

    if (errorCal) {
        console.error('Error al insertar en calendario:', errorCal);
        alert('No se pudo registrar la fecha en el calendario.');
        return;
    }

    alert('Tarea asignada correctamente.');
    const modalInstance = bootstrap.Modal.getInstance(asignacionModal);
    modalInstance.hide();
});

document.addEventListener('DOMContentLoaded', () => {
    cargarOpciones('unidad', 'unidades', 'id_unidad', 'nombre')
    cargarOpciones('sistema', 'sistemas', 'id_sistema', 'tipo')
    cargarOpciones('periodicidad', 'periodicidad', 'id_periodicidad', 'nombre')
    cargarProveedores()
    cargarTareas()
    
})
