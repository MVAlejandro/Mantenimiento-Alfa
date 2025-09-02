
// IMPORTACIÓN DE FUNCIONES EXTERNAS
// Importar funciones de validación de campos
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarCosto} from "./validaciones/regex.js"

// Crear evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const id_refaccion = document.getElementById('id_r').value;
    const nombre = document.getElementById('nombre_r').value;
    const costo_unitario = document.getElementById('costo').value;
    const unidad_medida = document.getElementById('refaccion_med').value;
    const descripcion = document.getElementById('descripcion').value;

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

    validarId(id_refaccionIn, error_id);
    validarText(nombreIn, error_nombre);
    validarCosto(costo_unitarioIn, error_año);
    validarText(unidad_medidaIn, error_unidadMed);
    validarText(descripcionIn, error_descripcion);

    if (!id_refaccion || !nombre || !costo_unitario || !unidad_medida || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    // Validar si hay campos inválidos
    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    const nuevaRefaccion = {id_refaccion, nombre, costo_unitario, unidad_medida, descripcion};

    // Obtener unidades del localStorage o inicializar arreglo
    let refacciones = JSON.parse(localStorage.getItem('refacciones')) || [];

    // Agregar una nueva unidad
    refacciones.push(nuevaRefaccion);
    // Guardar en localStorage
    localStorage.setItem('refacciones', JSON.stringify(refacciones));

    alert("Datos guardados correctamente. Refacción agregada con éxito.");
    // Recargar
    location.reload();
})

function abrirDetalles() {
    // Mostrar elementos guardados
    const desglose = document.getElementById('desglose');
    desglose.innerHTML = '';

    const refacciones = JSON.parse(localStorage.getItem('refacciones')) || [];

    if (refacciones.length === 0) {
        desglose.innerHTML = '<p>No hay refacciones registradas.</p>';
        return;
    }

    refacciones.forEach((refaccion, index) => {
        const refaccionHTML = 
        `<div class="card mb-3">
            <div class="card-header">
                <strong>ID:</strong> ${refaccion.id_refaccion}
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${refaccion.nombre}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Costo:</strong> $${refaccion.costo_unitario}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Unidad:</strong> ${refaccion.unidad_medida}</p>
                    </div>
                </div>
                <p class="info"><strong>Descripción:</strong> ${refaccion.descripcion}</p>
            </div>
        </div>`;
        desglose.innerHTML += refaccionHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    abrirDetalles();
});