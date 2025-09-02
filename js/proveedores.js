
// IMPORTACIÓN DE FUNCIONES EXTERNAS
// Importar funciones de validación de campos
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarTelefono, validarEmail, validarNombre} from "./validaciones/regex.js"

// Crear evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const id_proveedor = document.getElementById('id_p').value;
    const nombre = document.getElementById('nombre_p').value;
    const empresa = document.getElementById('empresa').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const descripcion = document.getElementById('descripcion').value;

    const id_proveedorIn = document.getElementById('id_p');
    const nombreIn = document.getElementById('nombre_p');
    const empresaIn = document.getElementById('empresa');
    const direccionIn = document.getElementById('direccion');
    const correoIn = document.getElementById('email');
    const telefonoIn = document.getElementById('telefono');
    const descripcionIn = document.getElementById('descripcion');

    const error_id = document.getElementById('error-id');
    const error_nombre = document.getElementById('error-nombre');
    const error_empresa = document.getElementById('error-empresa');
    const error_direccion = document.getElementById('error-direccion');
    const error_telefono = document.getElementById('error-telefono');
    const error_correo = document.getElementById('error-email');
    const error_descripcion = document.getElementById('error-descripcion');

    validarId(id_proveedorIn, error_id);
    validarNombre(nombreIn, error_nombre);
    validarText(empresaIn, error_empresa);
    validarText(direccionIn, error_direccion);
    validarTelefono(telefonoIn, error_telefono);
    validarEmail(correoIn, error_correo);
    validarText(descripcionIn, error_descripcion);
    

    if (!id_proveedor || !nombre || !empresa || !direccion || !correo || !telefono || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    // Validar si hay campos inválidos
    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    const nuevaproveedor = {id_proveedor, nombre, empresa, direccion, telefono, correo, descripcion};

    // Obtener proveedores del localStorage o inicializar arreglo
    let proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

    // Agregar una nueva proveedor
    proveedores.push(nuevaproveedor);
    // Guardar en localStorage
    localStorage.setItem('proveedores', JSON.stringify(proveedores));

    alert("Datos guardados correctamente. proveedor agregada con éxito.");
    // Recargar
    location.reload();
})

function abrirDetalles() {
    // Mostrar elementos guardados
    const desglose = document.getElementById('desglose');
    desglose.innerHTML = '';

    const proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];

    if (proveedores.length === 0) {
        desglose.innerHTML = '<p>No hay proveedores registradas.</p>';
        return;
    }

    proveedores.forEach((proveedor, index) => {
        const proveedorHTML = 
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
                <p class="info"><strong>Descripción:</strong> ${proveedor.descripcion}</p>
            </div>
        </div>`;
        desglose.innerHTML += proveedorHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    abrirDetalles();
});
