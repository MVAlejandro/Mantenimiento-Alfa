
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import { validarCamposInvalidos, validarSelect } from "../js/validaciones/validar_campos.js"
import { validarText, validarId, validarAño } from "./validaciones/regex.js"

// Función para cargar encargados en el select
async function cargarEncargados() {
    const { data, error } = await supabase.from('encargados').select('id_encargado, nombre')
    const select = document.getElementById('encargado')
    select.innerHTML = '<option value="0">Seleccione...</option>'

    if (error) {
        console.error('Error cargando encargados:', error)
        return
    }

    data.forEach(encargado => {
        const option = document.createElement('option')
        option.value = encargado.id_encargado
        option.textContent = encargado.nombre
        select.appendChild(option)
    })
}

// Función para insertar una nueva unidad en Supabase
async function insertarUnidad(unidad) {
    const { data, error } = await supabase.from('unidades').insert([unidad])

    if (error) {
        console.error(error)
        alert('Error al guardar la unidad: ' + error.message)
    } else {
        alert('Unidad agregada con éxito')
        cargarUnidades() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función para cargar las unidades desde Supabase
async function cargarUnidades() {
    const desglose = document.getElementById('desglose')
    desglose.innerHTML = ''

    const { data, error } = await supabase
    .from('unidades')
    .select(`
        id_unidad,
        nombre,
        modelo,
        anio,
        departamento,
        descripcion,
        id_encargado (nombre)
        `)

    if (error) {
        desglose.innerHTML = '<p>Error al cargar unidades</p>'
        console.error(error)
        return
    }

    if (data.length === 0) {
        desglose.innerHTML = '<p>No hay unidades registradas.</p>'
        return
    }

    data.forEach(unidad => {
        desglose.innerHTML += `
        <div class="card mb-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-6"><strong>ID:</strong> ${unidad.id_unidad}</div>
                    <div class="col-6 text-end"><strong>Encargado:</strong> ${unidad.id_encargado?.nombre}</div>
                </div>
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${unidad.nombre}</p>
                <div class="row">
                    <div class="col-6"><p class="info"><strong>Modelo:</strong> ${unidad.modelo}</p></div>
                    <div class="col-6"><p class="info"><strong>Año:</strong> ${unidad.anio}</p></div>
                </div>
                <p class="info"><strong>Departamento:</strong> ${unidad.departamento}</p>
                <p class="info"><strong>Descripción:</strong> ${unidad.descripcion}</p>
            </div>
        </div>`
    })
}

// Evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const id_unidad = document.getElementById('id_u').value
    const nombre = document.getElementById('nombre_u').value
    const modelo = document.getElementById('modelo').value
    const anio = document.getElementById('año').value
    const departamento = document.getElementById('departamento').value
    const descripcion = document.getElementById('descripcion').value
    const id_encargado = document.getElementById('encargado').value

    // Referencias para validación
    const id_unidadIn = document.getElementById('id_u')
    const nombreIn = document.getElementById('nombre_u')
    const modeloIn = document.getElementById('modelo')
    const anioIn = document.getElementById('año')
    const departamentoIn = document.getElementById('departamento')
    const descripcionIn = document.getElementById('descripcion')
    const id_encargadoIn = document.getElementById('encargado')

    const error_id = document.getElementById('error-id')
    const error_nombre = document.getElementById('error-nombre')
    const error_modelo = document.getElementById('error-modelo')
    const error_año = document.getElementById('error-año')
    const error_departamento = document.getElementById('error-departamento')
    const error_descripcion = document.getElementById('error-descripcion')
    const error_encargado = document.getElementById('error-encargado')

    // Validaciones
    validarId(id_unidadIn, error_id)
    validarText(nombreIn, error_nombre)
    validarText(modeloIn, error_modelo)
    validarAño(anioIn, error_año)
    validarSelect(departamentoIn, error_departamento)
    validarText(descripcionIn, error_descripcion)
    validarSelect(id_encargadoIn, error_encargado)

    if (!id_unidad || !nombre || !modelo || !anio || !departamento || !descripcion || !id_encargado) {
        alert('Por favor, complete todos los campos para agregar la entrada.')
        return
    }

    const campos = document.querySelectorAll('input, select')
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Insertar en Supabase
    const nuevaUnidad = { id_unidad, nombre, modelo, anio, departamento, descripcion, id_encargado }
    await insertarUnidad(nuevaUnidad)
})

// Cargar los encargados y unidades al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarEncargados()
    cargarUnidades()
})