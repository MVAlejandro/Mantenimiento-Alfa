
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarTelefono, validarEmail, validarNombre} from "./validaciones/regex.js"

// Función para insertar un nuevo proveedor en Supabase
async function insertarProveedor(proveedor) {
    const { data, error } = await supabase.from('proveedores').insert([proveedor])

    if (error) {
        console.error(error)
        alert('Error al guardar el proveedor: ' + error.message)
    } else {
        alert('Proveedor agregado con éxito')
        cargarProveedores() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función para cargar los proveedores desde Supabase
async function cargarProveedores() {
    const { data, error } = await supabase.from('proveedores').select('*')

    const desglose = document.getElementById('desglose')
    desglose.innerHTML = ''

    if (error) {
        desglose.innerHTML = '<p>Error al cargar proveedores</p>'
        console.error(error)
        return
    }

    if (data.length === 0) {
        desglose.innerHTML = '<p>No hay proveedores registradas.</p>'
        return
    }

    data.forEach(proveedor => {
        desglose.innerHTML +=
        `<div class="card mb-3">
            <div class="card-header">
                <strong>ID:</strong> ${proveedor.id_proveedor}
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${proveedor.nombre}</p>
                <p class="info"><strong>Empresa:</strong> ${proveedor.empresa}</p>
                <p class="info"><strong>Direccion:</strong> ${proveedor.direccion}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Teléfono:</strong> ${proveedor.telefono}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Correo:</strong> ${proveedor.correo}</p>
                    </div>
                </div>
            </div>
        </div>`;
    })
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
document.addEventListener('DOMContentLoaded', () => {
    cargarProveedores()
})
