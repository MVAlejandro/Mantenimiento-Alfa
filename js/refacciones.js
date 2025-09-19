
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarCosto} from "./validaciones/regex.js"

// Función centralizada para obtener refacciones
async function obtenerRefaccionesCompletas() {
    const { data, error } = await supabase
        .from('refacciones')
        .select('*');
    
    if (error) {
        console.error('Error obteniendo refacciones:', error);
        throw error;
    }
    
    return data.map(refaccion => ({
        id_refaccion: refaccion.id_refaccion,
        nombre: refaccion.nombre,
        costo_unitario: refaccion.costo_unitario,
        unidad_medida: refaccion.unidad_medida,
        descripcion: refaccion.descripcion
    }));
}

// Función para insertar una nueva refacción en Supabase
async function insertarRefaccion(refaccion) {
    const { data, error } = await supabase.from('refacciones').insert([refaccion])

    if (error) {
        console.error(error)
        alert('Error al guardar la refaccion: ' + error.message)
    } else {
        alert('Refaccion agregada con éxito')
        generarTablaRefacciones() // actualizar listado
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

    // Obtener refacciones usando la función centralizada
    const refacciones = await obtenerRefaccionesCompletas();
    if (!refacciones) return;

    let opciones = [];

    // Obtener valores únicos según el tipo
    switch (tipo) {
        case 'id_refaccion':
            opciones = refacciones.map(r => r.id_refaccion);
            break;
        case 'nombre':
            opciones = refacciones.map(r => r.nombre);
            break;
        case 'unidad_medida':
            opciones = refacciones.map(r => r.unidad_medida);
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

    // Obtener refacciones usando la función centralizada
    const refaccionesProcesadas = await obtenerRefaccionesCompletas();
    if (!refaccionesProcesadas) return;

    // Si no hay filtros activos, mostrar todo
    const sinFiltros =
        tipo === '0' &&
        (!valorSeleccionado || valorSeleccionado === '0') &&
        textoBusqueda === '';

    if (sinFiltros) {
        generarTablaRefacciones(refaccionesProcesadas);
        return;
    }

    // Aplicar filtros
    const filtradas = refaccionesProcesadas.filter(r => {
        let cumpleSelect = true;
        let cumpleBusqueda = true;

        // Filtro por select dinámico
        if (tipo !== '0' && valorSeleccionado !== '0') {
            const campo = r[tipo]?.toString().toLowerCase();
            cumpleSelect = campo === valorSeleccionado.toLowerCase();
        }

        // Filtro por búsqueda libre
        if (textoBusqueda) {
            cumpleBusqueda = Object.values(r).some(valor =>
                valor?.toString().toLowerCase().includes(textoBusqueda)
            );
        }

        return cumpleSelect && cumpleBusqueda;
    });

    generarTablaRefacciones(filtradas);
});

// Función para cargar las refacciones desde Supabase en la tabla
function generarTablaRefacciones(refacciones) {
    const tbody = document.querySelector('#tabla_refacciones tbody');
    tbody.innerHTML = '';

    if (!refacciones || refacciones.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay refacciones que coincidan con los filtros</td></tr>`;
        return;
    }

    refacciones.forEach(refaccion => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${refaccion.id_refaccion}</th>
            <td>${refaccion.nombre}</td>
            <td>${refaccion.costo_unitario}</td>
            <td>${refaccion.unidad_medida}</td>
            <td>${refaccion.descripcion}</td>
            <td><button type="button" class="btn btn-primary refaccion-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#refaccion_modal"
                    data-refaccion='${JSON.stringify(refaccion)}'>
                    Editar
                </button></td>
        </tr>`;
    });
}

// Evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const id_refaccion = document.getElementById('id_r').value;
    const nombre = document.getElementById('nombre_r').value;
    const costo_unitario = document.getElementById('costo').value;
    const unidad_medida = document.getElementById('refaccion_med').value;
    const descripcion = document.getElementById('descripcion').value;

    // Referencias para validación
    const id_refaccionIn = document.getElementById('id_r');
    const nombreIn = document.getElementById('nombre_r');
    const costo_unitarioIn = document.getElementById('costo');
    const unidad_medidaIn = document.getElementById('refaccion_med');
    const descripcionIn = document.getElementById('descripcion');

    const error_id = document.getElementById('error-id');
    const error_nombre = document.getElementById('error-nombre');
    const error_año = document.getElementById('error-costo');
    const error_unidadMed = document.getElementById('error-refaccion_med');
    const error_descripcion = document.getElementById('error-descripcion');

    // Validaciones
    validarId(id_refaccionIn, error_id);
    validarText(nombreIn, error_nombre);
    validarCosto(costo_unitarioIn, error_año);
    validarText(unidad_medidaIn, error_unidadMed);
    validarText(descripcionIn, error_descripcion);

    if (!id_refaccion || !nombre || !costo_unitario || !unidad_medida || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    // Insertar en Supabase
    const nuevaRefaccion = {id_refaccion, nombre, costo_unitario, unidad_medida, descripcion};
    await insertarRefaccion(nuevaRefaccion)
})

// Cargar las refacciones al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    generarTablaRefacciones()

    const refaccionesProcesadas = await obtenerRefaccionesCompletas();
        if (refaccionesProcesadas) {
            generarTablaRefacciones(refaccionesProcesadas);
        }
})

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('refaccion-btn')) {
        const unidadData = JSON.parse(e.target.getAttribute('data-refaccion'));
        cargarDatosEnModal(unidadData);
    }
});

// Función para cargar datos en el modal
function cargarDatosEnModal(refaccion) {
    // Campos no editables (solo lectura)
    document.getElementById('edit_id_refaccion').value = refaccion.id_refaccion;
    document.getElementById('edit_id_display').value = refaccion.id_refaccion;
    
    // Campos editables
    document.getElementById('edit_nombre').value = refaccion.nombre;
    document.getElementById('edit_unidad').value = refaccion.unidad_medida;
    document.getElementById('edit_costo').value = refaccion.costo_unitario;
    document.getElementById('edit_descripcion').value = refaccion.descripcion;
}

// Función para guardar cambios
document.getElementById('btn_guardar_cambios').addEventListener('click', async function() {
    const id_refaccion = document.getElementById('edit_id_refaccion').value;
    const nombre = document.getElementById('edit_nombre').value;
    const unidad_medida = document.getElementById('edit_unidad').value;
    const costo_unitario = document.getElementById('edit_costo').value;
    const descripcion = document.getElementById('edit_descripcion').value;

    // Validar campos requeridos
    if (!nombre || !unidad_medida || !costo_unitario || !descripcion) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    // Actualizar en Supabase
    const { data, error } = await supabase
        .from('refacciones')
        .update({ 
            nombre: nombre, 
            unidad_medida: unidad_medida, 
            costo_unitario: costo_unitario, 
            descripcion: descripcion 
        })
        .eq('id_refaccion', id_refaccion);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la refacción: ' + error.message);
    } else {
        alert('Refacción actualizada correctamente');
        generarTablaRefacciones();
        bootstrap.Modal.getInstance(document.getElementById('refaccion_modal')).hide();
    }
});
