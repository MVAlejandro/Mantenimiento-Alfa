
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarTelefono, validarEmail, validarNombre} from "./validaciones/regex.js"

// Función centralizada para obtener proveedores
async function obtenerProveedoresCompletos() {
    const { data, error } = await supabase
        .from('proveedores')
        .select('*');
    
    if (error) {
        console.error('Error obteniendo proveedores:', error);
        throw error;
    }
    
    return data.map(proveedor => ({
        id_proveedor: proveedor.id_proveedor,
        nombre: proveedor.nombre,
        empresa: proveedor.empresa,
        direccion: proveedor.direccion,
        telefono: proveedor.telefono,
        correo: proveedor.correo
    }));
}

// Función para insertar un nuevo proveedor en Supabase
async function insertarProveedor(proveedor) {
    const { data, error } = await supabase.from('proveedores').insert([proveedor])

    if (error) {
        console.error(error)
        alert('Error al guardar el proveedor: ' + error.message)
    } else {
        alert('Proveedor agregado con éxito')
        generarTablaProveedores() // actualizar listado
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

    // Obtener proveedores usando la función centralizada
    const proveedores = await obtenerProveedoresCompletos();
    if (!proveedores) return;

    let opciones = [];

    // Obtener valores únicos según el tipo
    switch (tipo) {
        case 'id_proveedor':
            opciones = proveedores.map(p => p.id_proveedor);
            break;
        case 'nombre':
            opciones = proveedores.map(p => p.nombre);
            break;
        case 'empresa':
            opciones = proveedores.map(p => p.empresa);
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

    // Obtener proveedores usando la función centralizada
    const proveedoresProcesados = await obtenerProveedoresCompletos();
    if (!proveedoresProcesados) return;

    // Si no hay filtros activos, mostrar todo
    const sinFiltros =
        tipo === '0' &&
        (!valorSeleccionado || valorSeleccionado === '0') &&
        textoBusqueda === '';

    if (sinFiltros) {
        generarTablaProveedores(proveedoresProcesados);
        return;
    }

    // Aplicar filtros
    const filtradas = proveedoresProcesados.filter(p => {
        let cumpleSelect = true;
        let cumpleBusqueda = true;

        // Filtro por select dinámico
        if (tipo !== '0' && valorSeleccionado !== '0') {
            const campo = p[tipo]?.toString().toLowerCase();
            cumpleSelect = campo === valorSeleccionado.toLowerCase();
        }

        // Filtro por búsqueda libre
        if (textoBusqueda) {
            cumpleBusqueda = Object.values(p).some(valor =>
                valor?.toString().toLowerCase().includes(textoBusqueda)
            );
        }

        return cumpleSelect && cumpleBusqueda;
    });

    generarTablaProveedores(filtradas);
});

// Función para cargar los proveedores desde Supabase en la tabla
function generarTablaProveedores(proveedores) {
    const tbody = document.querySelector('#tabla_proveedores tbody');
    tbody.innerHTML = '';

    if (!proveedores || proveedores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay proveedores que coincidan con los filtros</td></tr>`;
        return;
    }

    proveedores.forEach(proveedor => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${proveedor.id_proveedor}</th>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.empresa}</td>
            <td>${proveedor.direccion}</td>
            <td>${proveedor.telefono}</td>
            <td>${proveedor.correo}</td>
            <td><button type="button" class="btn btn-primary proveedor-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#proveedor_modal"
                    data-proveedor='${JSON.stringify(proveedor)}'>
                    Editar
                </button></td>
        </tr>`;
    });
}

// Evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const id_proveedor = document.getElementById('id_p').value;
    const nombre = document.getElementById('nombre_p').value;
    const empresa = document.getElementById('empresa').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    // Referencias para validación
    const id_proveedorIn = document.getElementById('id_p');
    const nombreIn = document.getElementById('nombre_p');
    const empresaIn = document.getElementById('empresa');
    const direccionIn = document.getElementById('direccion');
    const correoIn = document.getElementById('email');
    const telefonoIn = document.getElementById('telefono');

    const error_id = document.getElementById('error-id');
    const error_nombre = document.getElementById('error-nombre');
    const error_empresa = document.getElementById('error-empresa');
    const error_direccion = document.getElementById('error-direccion');
    const error_telefono = document.getElementById('error-telefono');
    const error_correo = document.getElementById('error-email');

    // Validaciones
    validarId(id_proveedorIn, error_id);
    validarNombre(nombreIn, error_nombre);
    validarText(empresaIn, error_empresa);
    validarText(direccionIn, error_direccion);
    validarTelefono(telefonoIn, error_telefono);
    validarEmail(correoIn, error_correo);

    if (!id_proveedor || !nombre || !empresa || !direccion || !correo || !telefono) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    // Insertar en Supabase
    const nuevoProveedor = {id_proveedor, nombre, empresa, direccion, telefono, correo};
    await insertarProveedor(nuevoProveedor)
})

// Cargar los proveedores al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    generarTablaProveedores()

    const proveedoresProcesados = await obtenerProveedoresCompletos();
    if (proveedoresProcesados) {
        generarTablaProveedores(proveedoresProcesados);
    }
})

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('proveedor-btn')) {
        const proveedorData = JSON.parse(e.target.getAttribute('data-proveedor'));
        cargarDatosEnModal(proveedorData);
    }
});

// Función para cargar datos en el modal
function cargarDatosEnModal(proveedor) {
    // Campos no editables (solo lectura)
    document.getElementById('edit_id_proveedor').value = proveedor.id_proveedor;
    document.getElementById('edit_id_display').value = proveedor.id_proveedor;
    
    // Campos editables
    document.getElementById('edit_nombre').value = proveedor.nombre;
    document.getElementById('edit_empresa').value = proveedor.empresa;
    document.getElementById('edit_direccion').value = proveedor.direccion;
    document.getElementById('edit_telefono').value = proveedor.telefono;
    document.getElementById('edit_email').value = proveedor.correo;
}

// Función para guardar cambios
document.getElementById('btn_guardar_cambios').addEventListener('click', async function() {
    const id_proveedor = document.getElementById('edit_id_proveedor').value;
    const nombre = document.getElementById('edit_nombre').value;
    const empresa = document.getElementById('edit_empresa').value;
    const direccion = document.getElementById('edit_direccion').value;
    const telefono = document.getElementById('edit_telefono').value;
    const correo = document.getElementById('edit_email').value;

    // Referencias para validación
    const nombreIn = document.getElementById('edit_nombre');
    const empresaIn = document.getElementById('edit_empresa');
    const direccionIn = document.getElementById('edit_direccion');
    const telefonoIn = document.getElementById('edit_telefono');
    const correoIn = document.getElementById('edit_email');

    const error_nombre = document.getElementById('error-editNombre');
    const error_empresa = document.getElementById('error-editEmpresa');
    const error_direccion = document.getElementById('error-editDireccion');
    const error_telefono = document.getElementById('error-editTelefono');
    const error_correo = document.getElementById('error-editEmail');

    // Validaciones
    validarNombre(nombreIn, error_nombre);
    validarText(empresaIn, error_empresa);
    validarText(direccionIn, error_direccion);
    validarTelefono(telefonoIn, error_telefono);
    validarEmail(correoIn, error_correo);

    // Validar campos requeridos
    if (!nombre || !empresa || !direccion || !telefono || !correo) {
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
        .from('proveedores')
        .update({ 
            nombre: nombre, 
            empresa: empresa, 
            direccion: direccion, 
            telefono: telefono,
            correo: correo 
        })
        .eq('id_proveedor', id_proveedor);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el proveedor: ' + error.message);
    } else {
        alert('proveedor actualizado correctamente');
        const proveedoresActualizados = await obtenerProveedoresCompletos();
        generarTablaProveedores(proveedoresActualizados);
        bootstrap.Modal.getInstance(document.getElementById('proveedor_modal')).hide();
    }
});
