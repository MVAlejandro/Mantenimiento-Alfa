
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import {validarCamposInvalidos} from "../js/validaciones/validar_campos.js"
import {validarText, validarId, validarCosto} from "./validaciones/regex.js"

// Función para insertar una nueva refacción en Supabase
async function insertarRefaccion(refaccion) {
    const { data, error } = await supabase.from('refacciones').insert([refaccion])

    if (error) {
        console.error(error)
        alert('Error al guardar la refacción: ' + error.message)
    } else {
        alert('Refacción agregada con éxito')
        cargarRefacciones() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función para cargar las refacciones desde Supabase
async function cargarRefacciones() {
    const { data, error } = await supabase.from('refacciones').select('*')

    const desglose = document.getElementById('desglose')
    desglose.innerHTML = ''

    if (error) {
        desglose.innerHTML = '<p>Error al cargar refacciones</p>'
        console.error(error)
        return
    }

    if (data.length === 0) {
        desglose.innerHTML = '<p>No hay refacciones registradas.</p>'
        return
    }

    data.forEach(refaccion => {
        desglose.innerHTML +=
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
        </div>`
    })
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
document.addEventListener('DOMContentLoaded', () => {
    cargarRefacciones()
})
