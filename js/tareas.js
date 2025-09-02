
// IMPORTACIÓN DE FUNCIONES EXTERNAS
// Importar funciones de validación de campos
import {validarCamposInvalidos, validarSelect} from "../js/validaciones/validar_campos.js"
import {validarText} from "./validaciones/regex.js"

// Crear evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre_t').value;
    const id_unidad = document.getElementById('unidad').value;
    const id_sistema = document.getElementById('sistema').value;
    const fecha_programada = document.getElementById('fecha').value;
    const id_periodicidad = document.getElementById('periodicidad').value;
    const id_proveedor = document.getElementById('responsable').value;
    const id_refaccion = document.getElementById('refacciones').value;
    const descripcion = document.getElementById('descripcion').value;

    const nombreIn = document.getElementById('nombre_t');
    const id_unidadIn = document.getElementById('unidad');
    const id_sistemaIn = document.getElementById('sistema');
    const fecha_programadaIn = document.getElementById('fecha');
    const id_periodicidadIn = document.getElementById('periodicidad');
    const id_proveedorIn = document.getElementById('responsable');
    const id_refaccionIn = document.getElementById('refacciones');
    const descripcionIn = document.getElementById('descripcion');

    const error_nombre = document.getElementById('error-nombre');
    const error_unidad = document.getElementById('error-unidad');
    const error_sistema = document.getElementById('error-sistema');
    const error_fecha = document.getElementById('error-fecha');
    const error_periodicidad = document.getElementById('error-periodicidad');
    const error_proveedor = document.getElementById('error-responsable');
    const error_refaccion = document.getElementById('error-refacciones');
    const error_descripcion = document.getElementById('error-descripcion');
    

    validarText(nombreIn, error_nombre);
    validarSelect(id_unidadIn, error_unidad)
    validarSelect(id_sistemaIn, error_sistema)
    validarText(id_periodicidadIn, error_periodicidad);
    validarSelect(id_proveedorIn, error_proveedor)
    validarSelect(id_refaccionIn, error_refaccion)
    validarText(descripcionIn, error_descripcion);

    if (!nombre || !id_unidad || !id_sistema || !id_periodicidad || !id_proveedor || !id_refaccion || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    // Validar si hay campos inválidos
    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    const nuevaTarea = {nombre, id_unidad, id_sistema, fecha_programada, id_periodicidad, id_proveedor, id_refaccion, descripcion};

    // Obtener unidades del localStorage o inicializar arreglo
    let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Agregar una nueva unidad
    tareas.push(nuevaTarea);
    // Guardar en localStorage
    localStorage.setItem('tareas', JSON.stringify(tareas));

    alert("Datos guardados correctamente. Tarea agregada con éxito.");
    // Recargar
    location.reload();
})


// Función para generar opciones del select en base a localStorage
function opcinesSelect(selectId, storageKey, valueKey, textKey) {
    const select = document.getElementById(selectId);

    if (!select) {
        console.warn(`No se encontró el elemento <select> con id "${selectId}"`);
        return;
    }

    const dataJSON = localStorage.getItem(storageKey);

    const items = JSON.parse(dataJSON);

    // Agregar las opciones
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    opcinesSelect('unidad', 'unidades', 'id_unidad', 'nombre');
    opcinesSelect('sistema', 'sistemas', 'tipo', 'tipo');
    opcinesSelect('responsable', 'proveedores', 'id_proveedor', 'nombre');
    opcinesSelect('refacciones', 'refacciones', 'id_refaccion', 'nombre');
});


// Función para mostrar elementos guardados
function abrirDetalles() {
    const desglose = document.getElementById('desglose');
    desglose.innerHTML = '';

    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    if (tareas.length === 0) {
        desglose.innerHTML = '<p>No hay tareas registradas.</p>';
        return;
    }

    tareas.forEach((tarea, index) => {
        const tareaHTML = 
        `<div class="card mb-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-6">
                        <strong>ID:</strong> ${tarea.id_tarea}
                    </div>
                    <div class="col-6 text-end">
                        <p class="info"><strong>ID Encargado:</strong> ${tarea.id_proveedor}</p>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${tarea.nombre}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Periodicidad:</strong> ${tarea.id_periodicidad}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Fecha programada:</strong> ${tarea.fecha_programada}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Unidad:</strong> ${tarea.id_unidad}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Sistema:</strong> ${tarea.id_sistema}</p>
                    </div>
                </div>
                <p class="info"><strong>Refacciones:</strong> ${tarea.id_refaccion}</p>
                <p class="info"><strong>Descripción:</strong> ${tarea.descripcion}</p>
            </div>
        </div>`;
        desglose.innerHTML += tareaHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    abrirDetalles();
});