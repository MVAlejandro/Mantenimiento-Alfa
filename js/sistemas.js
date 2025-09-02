
// IMPORTACIÓN DE FUNCIONES EXTERNAS
// Importar funciones de validación de campos
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText} from "./validaciones/regex.js"

// Crear evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const tipo = document.getElementById('tipo').value;
    const descripcion = document.getElementById('descripcion').value;

    const tipoIn = document.getElementById('tipo');
    const descripcionIn = document.getElementById('descripcion');

    const error_tipo = document.getElementById('error-tipo');
    const error_descripcion = document.getElementById('error-descripcion');

    validarText(tipoIn, error_tipo);
    validarText(descripcionIn, error_descripcion);

    if (!tipo || !descripcion) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    // Validar si hay campos inválidos
    const campos = document.querySelectorAll('input');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    const nuevoSistema = {tipo, descripcion,};

    // Obtener sistemaes del localStorage o inicializar arreglo
    let sistemas = JSON.parse(localStorage.getItem('sistemas')) || [];

    // Agregar una nueva sistema
    sistemas.push(nuevoSistema);
    // Guardar en localStorage
    localStorage.setItem('sistemas', JSON.stringify(sistemas));

    alert("Datos guardados correctamente. Sistema agregado con éxito.");
    // Recargar
    location.reload();
})

function abrirDetalles() {
    // Mostrar elementos guardados
    const desglose = document.getElementById('desglose');
    desglose.innerHTML = '';

    const sistemas = JSON.parse(localStorage.getItem('sistemas')) || [];

    if (sistemas.length === 0) {
        desglose.innerHTML = '<p>No hay sistemas registrados.</p>';
        return;
    }

    sistemas.forEach((sistema, index) => {
        const sistemaHTML = 
        `<div class="card mb-3">
            <div class="card-header">
                <strong>ID:</strong> ${sistema.id_sistema}
            </div>
            <div class="card-body">
                <p class="info"><strong>Tipo de sistema:</strong> ${sistema.tipo}</p>
                <p class="info"><strong>Descripción:</strong> ${sistema.descripcion}</p>
            </div>
        </div>`;
        desglose.innerHTML += sistemaHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    abrirDetalles();
});