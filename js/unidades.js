
// IMPORTACIÓN DE FUNCIONES EXTERNAS
// Importar funciones de validación de campos
import {validarCamposInvalidos, validarSelect} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarAño} from "./validaciones/regex.js"

// Crear evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault();

    // Obtener los valores de los campos del formulario
    const id_unidad = document.getElementById('id_u').value;
    const nombre = document.getElementById('nombre_u').value;
    const modelo = document.getElementById('modelo').value;
    const anio = document.getElementById('año').value;
    const descripcion = document.getElementById('descripcion').value;
    const id_encargado = document.getElementById('responsable').value;

    const id_unidadIn = document.getElementById('id_u');
    const nombreIn = document.getElementById('nombre_u');
    const modeloIn = document.getElementById('modelo');
    const anioIn = document.getElementById('año');
    const descripcionIn = document.getElementById('descripcion');
    const id_encargadoIn = document.getElementById('responsable');

    const error_id = document.getElementById('error-id');
    const error_nombre = document.getElementById('error-nombre');
    const error_modelo = document.getElementById('error-modelo');
    const error_año = document.getElementById('error-año');
    const error_descripcion = document.getElementById('error-descripcion');
    const error_responsable = document.getElementById('error-responsable');

    validarId(id_unidadIn, error_id);
    validarText(nombreIn, error_nombre);
    validarText(modeloIn, error_modelo);
    validarAño(anioIn, error_año);
    validarText(descripcionIn, error_descripcion);
    validarSelect(id_encargadoIn, error_responsable)

    if (!id_unidad || !nombre || !modelo || !anio || !descripcion || !id_encargado) {
        alert('Por favor, complete todos los campos para agregar la entrada.');
        return;
    }

    // Validar si hay campos inválidos
    const campos = document.querySelectorAll('input, select');
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.');
        return;
    }

    const nuevaUnidad = { id_unidad, nombre, modelo, anio, descripcion, id_encargado };

    // Obtener unidades del localStorage o inicializar arreglo
    let unidades = JSON.parse(localStorage.getItem('unidades')) || [];

    // Agregar una nueva unidad
    unidades.push(nuevaUnidad);
    // Guardar en localStorage
    localStorage.setItem('unidades', JSON.stringify(unidades));

    alert("Datos guardados correctamente. Unidad agregada con éxito.");
    // Recargar
    location.reload();
})

function abrirDetalles() {
    // Mostrar elementos guardados
    const desglose = document.getElementById('desglose');
    desglose.innerHTML = '';

    const unidades = JSON.parse(localStorage.getItem('unidades')) || [];

    if (unidades.length === 0) {
        desglose.innerHTML = '<p>No hay unidades registradas.</p>';
        return;
    }

    unidades.forEach((unidad, index) => {
        const unidadHTML = 
        `<div class="card mb-3">
            <div class="card-header">
                <strong>Unidad #${index + 1}</strong>
            </div>
            <div class="card-body">
                <p><strong>ID:</strong> ${unidad.id_unidad}</p>
                <p><strong>Nombre:</strong> ${unidad.nombre}</p>
                <p><strong>Modelo:</strong> ${unidad.modelo}</p>
                <p><strong>Año:</strong> ${unidad.anio}</p>
                <p><strong>Descripción:</strong> ${unidad.descripcion}</p>
                <p><strong>ID Encargado:</strong> ${unidad.id_encargado}</p>
            </div>
        </div>`;
        desglose.innerHTML += unidadHTML;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    abrirDetalles();
});

