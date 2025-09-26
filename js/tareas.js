
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import { validarCamposInvalidos, validarSelect } from "../js/validaciones/validar_campos.js"
import { validarText } from "./validaciones/regex.js"
import { cargarOpciones } from './funciones/cargar_select.js';

// Función centralizada para obtener unidades
async function obtenerTareasCompletas() {
    const { data, error } = await supabase
        .from('tareas')
        .select(`
            id_tarea,
            nombre,
            descripcion,
            id_unidad,
            id_sistema,
            id_periodicidad,
            unidades (nombre),
            sistemas (tipo),
            periodicidad (nombre)
        `);

    if (error) {
        console.error('Error obteniendo tareas:', error);
        throw error;
    }

    return data.map(tarea => ({
        id_tarea: tarea.id_tarea,
        nombre: tarea.nombre,
        descripcion: tarea.descripcion,
        id_unidad: tarea.id_unidad,                     
        unidad: tarea.unidades?.nombre,                 
        id_sistema: tarea.id_sistema,
        sistema: tarea.sistemas?.tipo,
        id_periodicidad: tarea.id_periodicidad,
        periodicidad: tarea.periodicidad?.nombre
    }));
}

// Función para insertar una nueva tarea en Supabase
async function insertarTarea(tarea) {
    const { data, error } = await supabase.from('tareas').insert([tarea])

    if (error) {
        console.error(error)
        alert('Error al guardar la tarea: ' + error.message)
    } else {
        alert('Tarea agregada con éxito')
        generarTablaTareas() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función de filtrado
document.getElementById('filtro_tipo').addEventListener('change', async function () {
    const tipo = this.value;
    const selectOrden = document.getElementById('filtro_orden');

    // Limpiar opciones anteriores
    selectOrden.innerHTML = '';

    if (tipo === '0') {
        selectOrden.disabled = true;
        return;
    }

    selectOrden.disabled = false;

    // Obtener tareas usando la función centralizada
    const tareas = await obtenerTareasCompletas();
    if (!tareas) return;

    let opciones = [];

    // Obtener valores únicos según el tipo
    switch (tipo) {
        case 'nombre':
            opciones = tareas.map(t => t.nombre);
            break;
        case 'unidad':
            opciones = tareas.map(t => t.unidad);
            break;
        case 'sistema':
            opciones = tareas.map(t => t.sistema);
            break;
        case 'periodicidad':
            opciones = tareas.map(t => t.periodicidad);
            break;
    }

    // Eliminar duplicados y valores vacíos
    const opcionesUnicas = [...new Set(opciones)].filter(v => v);

    // Agregar opciones al select
    selectOrden.innerHTML = '<option value="0">Todos</option>';
    opcionesUnicas.forEach(opcion => {
        const optionEl = document.createElement('option');
        optionEl.value = opcion;
        optionEl.textContent = opcion;
        selectOrden.appendChild(optionEl);
    });
});

// Función al dar click en botón de filtrado
document.getElementById('btn_filtro').addEventListener('click', async function () {
    const tipo = document.getElementById('filtro_tipo').value;
    const valorSeleccionado = document.getElementById('filtro_orden').value;
    const textoBusqueda = document.getElementById('filtro_buscar').value.trim().toLowerCase();

    // Obtener tareas usando la función centralizada
    const tareasProcesadas = await obtenerTareasCompletas();
    if (!tareasProcesadas) return;

    // Si no hay filtros activos, mostrar todo
    const sinFiltros =
        tipo === '0' &&
        (!valorSeleccionado || valorSeleccionado === '0') &&
        textoBusqueda === '';

    if (sinFiltros) {
        generarTablaTareas(tareasProcesadas);
        return;
    }

    // Aplicar filtros
    const filtradas = tareasProcesadas.filter(t => {
        let cumpleSelect = true;
        let cumpleBusqueda = true;

        // Filtro por select dinámico
        if (tipo !== '0' && valorSeleccionado !== '0') {
            const campo = t[tipo]?.toString().toLowerCase();
            cumpleSelect = campo === valorSeleccionado.toLowerCase();
        }

        // Filtro por búsqueda libre
        if (textoBusqueda) {
            cumpleBusqueda = Object.values(t).some(valor =>
                valor?.toString().toLowerCase().includes(textoBusqueda)
            );
        }

        return cumpleSelect && cumpleBusqueda;
    });

    generarTablaTareas(filtradas);
});

// Función para cargar las tareas desde Supabase en la tabla
function generarTablaTareas(tareas) {
    const tbody = document.querySelector('#tabla_tareas tbody');
    tbody.innerHTML = '';

    if (!tareas || tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay tareas que coincidan con los filtros</td></tr>`;
        return;
    }

    tareas.forEach(tarea => {
        tbody.innerHTML += 
        `<tr>
            <td><button id="#" type="button" class="btn btn-modal"
                    data-bs-toggle="modal"
                    data-bs-target="#asignacion_modal"
                    data-idtarea="${tarea.id_tarea}">
                    Asignar
                </button></td>
            <th scope="row">${tarea.id_tarea}</th>
            <td>${tarea.nombre}</td>
            <td>${tarea.unidad}</td>
            <td>${tarea.sistema}</td>
            <td>${tarea.periodicidad}</td>
            <td>${tarea.descripcion}</td>
            <td><button type="button" class="btn btn-primary tarea-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#tarea_modal"
                    data-tarea='${JSON.stringify(tarea)}'>
                    Editar
                </button></td>
        </tr>`;

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
    const responsable = document.getElementById('responsable');
    const contenedor = document.getElementById("tarea-proveedor");
        responsable.addEventListener('change', async function () {
            if (responsable.value === '6'){
                contenedor.innerHTML = 
                `<div class="col-lg-2 d-flex align-items-center">
                    <label for="proveedor" class="form-label">Proveedor:</label>
                </div>
                <div class="col-lg-9 ms-auto">
                    <select id="proveedor" class="form-select" aria-label="Default select example">
                        <option value="0">Seleccione...</option>
                        
                    </select>
                    <p class="error invalid-feedback" id="error-responsable" style="color: red;"></p>
                </div>`;

                const { data: proveedores, error } = await supabase
                    .from('proveedores')
                    .select('id_proveedor, nombre')
                    .not('id_proveedor', 'in', '(1,2,3,4,5)');

                const select = document.getElementById('proveedor');
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

            } else {
                contenedor.innerHTML = '';
            }
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

    // Recarga la tabla con los datos actualizados
    const tareasActualizadas = await obtenerTareasCompletas();
    generarTablaTareas(tareasActualizadas);
})

// Evento al dar click al botón Asignar
document.getElementById('btn_asignar').addEventListener('click', async () => {
    const asignacionModal = document.getElementById('asignacion_modal');
    const idTarea = asignacionModal.dataset.idTarea;

    const responsable = document.getElementById('responsable').value;
    let proveedorSeleccionado = null;

    if (responsable === "6") {
        const proveedorExterno = document.getElementById('proveedor').value;

        if (!proveedorExterno || proveedorExterno === "0") {
            alert('Seleccione un proveedor externo.');
            return;
        }

        proveedorSeleccionado = proveedorExterno;
    } else {
        proveedorSeleccionado = responsable;
    }

    const fechaProgramada = document.getElementById('fecha_programada').value;

    if (!fechaProgramada) {
        alert('Ingrese una fecha programada.');
        return;
    }

    // Asignar proveedor a tarea
    const { error: errorTP } = await supabase
        .from('tarea_proveedor')
        .insert([{ id_tarea: idTarea, id_proveedor: proveedorSeleccionado }]);

    if (errorTP) {
        console.error('Error al insertar en tarea_proveedor:', errorTP);
        alert('No se pudo asignar la tarea.');
        return;
    }

    // Obtener periodicidad y repeticiones
    const { data: tareaData, error: tareaError } = await supabase
        .from('tareas')
        .select('id_periodicidad')
        .eq('id_tarea', idTarea)
        .single();

    if (tareaError || !tareaData) {
        alert('No se pudo obtener la tarea.');
        return;
    }

    const { data: periodicidadData, error: periodicidadError } = await supabase
        .from('periodicidad')
        .select('nombre, repeticiones')
        .eq('id_periodicidad', tareaData.id_periodicidad)
        .single();

    if (periodicidadError || !periodicidadData) {
        alert('No se pudo obtener la periodicidad.');
        return;
    }

    // Función para formatear fecha en YYYY-MM-DD
    function formatearFecha(fecha) {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Función para generar fechas periódicas solo dentro del año en curso
    function generarFechasPeriodicas(fechaInicial, periodicidad, repeticiones) {
        const fechas = [];

        let [year, month, day] = fechaInicial.split('-').map(Number);
        let fecha = new Date(year, month - 1, day);
        fecha.setHours(0, 0, 0, 0);

        const finDeAnio = new Date(new Date().getFullYear(), 11, 31); // 31 de diciembre del año actual

        for (let i = 0; i < repeticiones; i++) {
            // Detener si la fecha ya pasa del año en curso
            if (fecha > finDeAnio) break; 

            fechas.push(new Date(fecha));

            if (['mensual', 'bimestral', 'trimestral', 'semestral', 'anual'].includes(periodicidad.nombre.toLowerCase())) {
                const mesesASumar = {
                    mensual: 1,
                    bimestral: 2,
                    trimestral: 3,
                    semestral: 6,
                    anual: 12
                }[periodicidad.nombre.toLowerCase()];
                fecha.setMonth(fecha.getMonth() + mesesASumar);
            } else {
                const diasASumar = {
                    diario: 1,
                    semanal: 7,
                    quincenal: 15
                }[periodicidad.nombre.toLowerCase()] || 1;
                fecha.setDate(fecha.getDate() + diasASumar);
            }

            fecha.setHours(0, 0, 0, 0);
        }

        return fechas;
    }

    // Generar fechas programadas
    const fechasProgramadas = generarFechasPeriodicas(fechaProgramada, periodicidadData, periodicidadData.repeticiones);

    // Preparar registros para insertar en calendario
    const registrosCalendario = fechasProgramadas.map(fecha => ({
        id_tarea: idTarea,
        fecha_programada: formatearFecha(fecha)
    }));

    // Insertar todas las fechas generadas en calendario
    const { error: errorCal } = await supabase
        .from('calendario')
        .insert(registrosCalendario);

    if (errorCal) {
        console.error('Error al insertar fechas en calendario:', errorCal);
        alert('No se pudo registrar las fechas en el calendario.');
        return;
    }

    alert('Tarea asignada correctamente.');
    const modalInstance = bootstrap.Modal.getInstance(asignacionModal);
    modalInstance.hide();
});

document.addEventListener('DOMContentLoaded', async () => {
    cargarOpciones('unidad', 'unidades', 'id_unidad', 'nombre')
    cargarOpciones('sistema', 'sistemas', 'id_sistema', 'tipo')
    cargarOpciones('periodicidad', 'periodicidad', 'id_periodicidad', 'nombre')

    cargarProveedores()
    generarTablaTareas()

    const tareasProcesadas = await obtenerTareasCompletas();
    if (tareasProcesadas) {
        generarTablaTareas(tareasProcesadas);
    }
})

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('tarea-btn')) {
        const tareaData = JSON.parse(e.target.getAttribute('data-tarea'));
        cargarDatosEnModal(tareaData);
    }
});

// Función para cargar datos en el modal
function cargarDatosEnModal(tarea) {
    // Campos no editables (solo lectura)
    document.getElementById('edit_id_tarea').value = tarea.id_tarea;
    document.getElementById('edit_id_display').value = tarea.id_tarea;
    
    // Campos editables
    document.getElementById('edit_nombre').value = tarea.nombre;
    cargarOpciones('edit_unidad', 'unidades', 'id_unidad', 'nombre', tarea.id_unidad)
    cargarOpciones('edit_sistema', 'sistemas', 'id_sistema', 'tipo', tarea.id_sistema)
    cargarOpciones('edit_periodicidad', 'periodicidad', 'id_periodicidad', 'nombre', tarea.id_periodicidad)
    document.getElementById('edit_descripcion').value = tarea.descripcion;
}

// Función para guardar cambios
document.getElementById('btn_guardar_cambios').addEventListener('click', async function() {
    const id_tarea = document.getElementById('edit_id_tarea').value;
    const nombre = document.getElementById('edit_nombre').value;
    const unidad = document.getElementById('edit_unidad').value;
    const sistema = document.getElementById('edit_sistema').value;
    const periodicidad = document.getElementById('edit_periodicidad').value;
    const descripcion = document.getElementById('edit_descripcion').value;

    // Referencias para validación
    const nombreIn = document.getElementById('edit_nombre');
    const descripcionIn = document.getElementById('edit_descripcion');

    const error_nombre = document.getElementById('edit_nombre');
    const error_descripcion = document.getElementById('error-editDescripcion');

    // Validaciones
    validarText(nombreIn, error_nombre);
    validarText(descripcionIn, error_descripcion);

    // Validar campos requeridos
    if (!nombre || !unidad || !sistema || !periodicidad || !descripcion) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    const campos = document.querySelectorAll('input')
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Actualizar en Supabase
    const { data, error } = await supabase
        .from('tareas')
        .update({ 
            nombre: nombre, 
            id_unidad: unidad,
            id_sistema: sistema,
            id_periodicidad: periodicidad,
            descripcion: descripcion 
        })
        .eq('id_tarea', id_tarea);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la tarea: ' + error.message);
    } else {
        alert('Tareas actualizada correctamente');
        const tareasActualizadas = await obtenerTareasCompletas();
        generarTablaTareas(tareasActualizadas);
        bootstrap.Modal.getInstance(document.getElementById('tarea_modal')).hide();
    }
});

// Eliminar entrada al dar click en el botón del segundo modal
document.getElementById('btn_eliminar_entrada').addEventListener('click', async () => {
    const idTarea = document.getElementById('edit_id_tarea').value;

    if (!idTarea) {
        alert('No se pudo obtener el ID de la tarea a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id_tarea', idTarea);

    if (error) {
        console.error('Error eliminando tarea:', error);
        alert('Ocurrió un error al eliminar la tarea.');
        return;
    }

    // Cerrar los modales
    const consultaModal = bootstrap.Modal.getInstance(document.getElementById('consulta_modal'));
    if (consultaModal) consultaModal.hide();

    const tareaModal = bootstrap.Modal.getInstance(document.getElementById('tarea_modal'));
    if (tareaModal) tareaModal.hide();

    // Recarga la tabla con los datos actualizados
    const tareasActualizadas = await obtenerTareasCompletas();
    generarTablaTareas(tareasActualizadas);

    // Mensaje de éxito
    alert('Tarea eliminada correctamente.');
});

