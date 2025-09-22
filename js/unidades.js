
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import { validarCamposInvalidos, validarSelect } from "../js/validaciones/validar_campos.js"
import { validarText, validarId, validarAño } from "./validaciones/regex.js"

// Función centralizada para obtener unidades
async function obtenerUnidadesCompletas() {
    const { data, error } = await supabase
        .from('unidades')
        .select(`
            id_unidad,
            nombre,
            modelo,
            anio,
            descripcion,
            id_empleado (
                nombre,
                departamentos (nombre)
            )
        `);
    
    if (error) {
        console.error('Error obteniendo unidades:', error);
        throw error;
    }
    
    return data.map(unidad => ({
        id_unidad: unidad.id_unidad,
        nombre: unidad.nombre,
        modelo: unidad.modelo,
        anio: unidad.anio,
        descripcion: unidad.descripcion,
        empleado: unidad.id_empleado?.nombre || 'Sin asignar',
        departamento: unidad.id_empleado?.departamentos?.nombre || 'Sin departamento'
    }));
}

// Función para insertar una nueva unidad en Supabase
async function insertarUnidad(unidad) {
    const { data, error } = await supabase.from('unidades').insert([unidad])

    if (error) {
        console.error(error)
        alert('Error al guardar la unidad: ' + error.message)
    } else {
        alert('Unidad agregada con éxito')
        generarTablaUnidades() // actualizar listado
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

    // Obtener unidades usando la función centralizada
    const unidades = await obtenerUnidadesCompletas();
    if (!unidades) return;

    let opciones = [];

    // Obtener valores únicos según el tipo
    switch (tipo) {
        case 'id_unidad':
            opciones = unidades.map(u => u.id_unidad);
            break;
        case 'nombre':
            opciones = unidades.map(u => u.nombre);
            break;
        case 'modelo':
            opciones = unidades.map(u => u.modelo);
            break;
        case 'año':
            opciones = unidades.map(u => u.anio);
            break;
        case 'departamento':
            opciones = unidades.map(u => u.departamento || 'Sin departamento');
            break;
        case 'empleado':
            opciones = unidades.map(u => u.empleado || 'Sin asignar');
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

    // Obtener unidades usando la función centralizada
    const unidadesProcesadas = await obtenerUnidadesCompletas();
    if (!unidadesProcesadas) return;

    // Si no hay filtros activos, mostrar todo
    const sinFiltros =
        tipo === '0' &&
        (!valorSeleccionado || valorSeleccionado === '0') &&
        textoBusqueda === '';

    if (sinFiltros) {
        generarTablaUnidades(unidadesProcesadas);
        return;
    }

    // Aplicar filtros
    const filtradas = unidadesProcesadas.filter(u => {
        let cumpleSelect = true;
        let cumpleBusqueda = true;

        // Filtro por select dinámico
        if (tipo !== '0' && valorSeleccionado !== '0') {
            const campo = tipo === 'año'
                ? u.anio.toString()
                : u[tipo]?.toString().toLowerCase();
            cumpleSelect = campo === valorSeleccionado.toLowerCase();
        }

        // Filtro por búsqueda libre
        if (textoBusqueda) {
            cumpleBusqueda = Object.values(u).some(valor =>
                valor?.toString().toLowerCase().includes(textoBusqueda)
            );
        }

        return cumpleSelect && cumpleBusqueda;
    });

    generarTablaUnidades(filtradas);
});

// Función para cargar las unidades desde Supabase en la tabla
function generarTablaUnidades(unidades) {
    const tbody = document.querySelector('#tabla_unidades tbody');
    tbody.innerHTML = '';

    if (!unidades || unidades.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay unidades que coincidan con los filtros</td></tr>`;
        return;
    }

    unidades.forEach(unidad => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${unidad.id_unidad}</th>
            <td>${unidad.nombre}</td>
            <td>${unidad.modelo}</td>
            <td>${unidad.anio}</td>
            <td>${unidad.departamento}</td>
            <td>${unidad.empleado}</td>
            <td>${unidad.descripcion}</td>
            <td><button type="button" class="btn btn-primary unidad-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#unidad_modal"
                    data-unidad='${JSON.stringify(unidad)}'>
                    Editar
                </button></td>
        </tr>`;
    });
}

// Función para cargar departamentos en el select del formulario
async function cargarDepartamentos() {
    const { data, error } = await supabase.from('departamentos').select('id_departamento, nombre');

    const selectDepto = document.getElementById('departamento');
    selectDepto.innerHTML = '<option value="0">Seleccione...</option>';

    if (error) {
        console.error("Error cargando departamentos:", error);
        return;
    }

    data.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.id_departamento;
        option.textContent = depto.nombre;
        selectDepto.appendChild(option);
    });
}

// Función para cargar empleado en el select del formulario
async function cargarEmpleados(idDepartamento) {
    const { data, error } = await supabase
        .from('empleados')
        .select('id_empleado, nombre')
        .eq('id_departamento', idDepartamento);

    const selectEmpleado = document.getElementById('empleado');
    selectEmpleado.innerHTML = '<option value="0">Seleccione...</option>';

    if (error) {
        console.error("Error cargando empleados:", error);
        return;
    }

    data.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id_empleado;
        option.textContent = emp.nombre;
        selectEmpleado.appendChild(option);
    });
}

// Detectar cambio en el select de departamento en formulario
document.getElementById('departamento').addEventListener('change', function() {
    const idDepto = this.value;
    if (idDepto !== "0") {
        cargarEmpleados(idDepto);
    } else {
        document.getElementById('empleado').innerHTML = '<option value="0">Seleccione...</option>';
    }
});

// Evento al dar click al botón Agregar Unidad
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const id_unidad = document.getElementById('id_u').value
    const nombre = document.getElementById('nombre_u').value
    const modelo = document.getElementById('modelo').value
    const anio = document.getElementById('año').value
    const departamento = document.getElementById('departamento').value
    const descripcion = document.getElementById('descripcion').value
    const id_empleado = document.getElementById('empleado').value

    // Referencias para validación
    const id_unidadIn = document.getElementById('id_u')
    const nombreIn = document.getElementById('nombre_u')
    const modeloIn = document.getElementById('modelo')
    const anioIn = document.getElementById('año')
    const departamentoIn = document.getElementById('departamento')
    const descripcionIn = document.getElementById('descripcion')
    const id_empleadoIn = document.getElementById('empleado')

    const error_id = document.getElementById('error-id')
    const error_nombre = document.getElementById('error-nombre')
    const error_modelo = document.getElementById('error-modelo')
    const error_año = document.getElementById('error-año')
    const error_departamento = document.getElementById('error-departamento')
    const error_descripcion = document.getElementById('error-descripcion')
    const error_empleado = document.getElementById('error-empleado')

    // Validaciones
    validarId(id_unidadIn, error_id)
    validarText(nombreIn, error_nombre)
    validarText(modeloIn, error_modelo)
    validarAño(anioIn, error_año)
    validarSelect(departamentoIn, error_departamento)
    validarText(descripcionIn, error_descripcion)
    validarSelect(id_empleadoIn, error_empleado)

    if (!id_unidad || !nombre || !modelo || !anio || !departamento || !descripcion || !id_empleado) {
        alert('Por favor, complete todos los campos para agregar la entrada.')
        return
    }

    const campos = document.querySelectorAll('input, select')
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Insertar en Supabase
    const nuevaUnidad = { id_unidad, nombre, modelo, anio, descripcion, id_empleado }
    await insertarUnidad(nuevaUnidad)
})

// Cargar los empleados, unidades y registros al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    cargarDepartamentos()
    generarTablaUnidades()

    const unidadesProcesadas = await obtenerUnidadesCompletas();
    if (unidadesProcesadas) {
        generarTablaUnidades(unidadesProcesadas);
    }
})

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('unidad-btn')) {
        const unidadData = JSON.parse(e.target.getAttribute('data-unidad'));
        cargarDatosEnModal(unidadData);
    }
});

// Función para cargar datos en el modal
function cargarDatosEnModal(unidad) {
    // Campos no editables (solo lectura)
    document.getElementById('edit_id_unidad').value = unidad.id_unidad;
    document.getElementById('edit_id_display').value = unidad.id_unidad;
    document.getElementById('edit_departamento').value = unidad.departamento;
    document.getElementById('edit_empleado').value = unidad.empleado;
    
    // Campos editables
    document.getElementById('edit_nombre').value = unidad.nombre;
    document.getElementById('edit_modelo').value = unidad.modelo;
    document.getElementById('edit_anio').value = unidad.anio;
    document.getElementById('edit_descripcion').value = unidad.descripcion;
}

// Función para guardar cambios
document.getElementById('btn_guardar_cambios').addEventListener('click', async function() {
    const id_unidad = document.getElementById('edit_id_unidad').value;
    const nombre = document.getElementById('edit_nombre').value;
    const modelo = document.getElementById('edit_modelo').value;
    const anio = document.getElementById('edit_anio').value;
    const descripcion = document.getElementById('edit_descripcion').value;

    // Referencias para validación
    const nombreIn = document.getElementById('edit_nombre');
    const modeloIn = document.getElementById('edit_modelo');
    const anioIn = document.getElementById('edit_anio');
    const descripcionIn = document.getElementById('edit_descripcion');

    const error_nombre = document.getElementById('error-editNombre');
    const error_modelo = document.getElementById('error-editModelo');
    const error_año = document.getElementById('error-editAnio');
    const error_descripcion = document.getElementById('error-editDescripcion');

    // Validaciones
    validarText(nombreIn, error_nombre)
    validarText(modeloIn, error_modelo)
    validarAño(anioIn, error_año)
    validarText(descripcionIn, error_descripcion)

    // Validar campos requeridos
    if (!nombre || !modelo || !anio || !descripcion) {
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
        .from('unidades')
        .update({ 
            nombre: nombre, 
            modelo: modelo, 
            anio: anio, 
            descripcion: descripcion 
        })
        .eq('id_unidad', id_unidad);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la unidad: ' + error.message);
    } else {
        alert('Unidad actualizada correctamente');
        const unidadesActualizadas = await obtenerUnidadesCompletas();
        generarTablaUnidades(unidadesActualizadas);
        bootstrap.Modal.getInstance(document.getElementById('unidad_modal')).hide();
    }
});