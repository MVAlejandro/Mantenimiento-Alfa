
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import { validarCamposInvalidos } from "../js/validaciones/validar_campos.js"
import { validarText } from "./validaciones/regex.js"

// Conexión a Supabase
const supabaseUrl = "https://omsxyeiwlchkpdojzbbk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tc3h5ZWl3bGNoa3Bkb2p6YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDQ3MjAsImV4cCI6MjA3MjY4MDcyMH0.EAAqXwFShq-B2L02XLL28g_NqhmFH1F4mpcqhAkWWRE"
const supabase = createClient(supabaseUrl, supabaseKey)

// Función para insertar un nuevo sistema en Supabase
async function insertarSistema(tipo, descripcion) {
    const { data, error } = await supabase
        .from('sistemas')
        .insert([{ tipo, descripcion }])

    if (error) {
        console.error(error)
        alert('Error al guardar el sistema: ' + error.message)
    } else {
        alert('Sistema agregado con éxito')
        cargarSistemas() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función para cargar los sistemas desde Supabase
async function cargarSistemas() {
    const { data, error } = await supabase.from('sistemas').select('*')
    const desglose = document.getElementById('desglose')
    
    if (error) {
        desglose.innerHTML = '<p>Error al cargar registros</p>'
        console.error(error)
        return
    }

    desglose.innerHTML = ''
    if (data.length === 0) {
        desglose.innerHTML = '<p>No hay sistemas registrados.</p>'
        return
    }

    data.forEach((sistema) => {
        const sistemaHTML = `
        <div class="card mb-3">
            <div class="card-header">
            <strong>ID:</strong> ${sistema.id_sistema}
            </div>
            <div class="card-body">
            <p class="info"><strong>Tipo de sistema:</strong> ${sistema.tipo}</p>
            <p class="info"><strong>Descripción:</strong> ${sistema.descripcion}</p>
            </div>
        </div>`
        desglose.innerHTML += sistemaHTML
    })
}

// Evento al dar click al botón Agregar
document.getElementById('btn_add').addEventListener('click', async function(event) {
    event.preventDefault()

    // Obtener valores de inputs
    const tipo = document.getElementById('tipo').value.trim()
    const descripcion = document.getElementById('descripcion').value.trim()

    // Referencias para validación
    const tipoIn = document.getElementById('tipo')
    const descripcionIn = document.getElementById('descripcion')
    const error_tipo = document.getElementById('error-tipo')
    const error_descripcion = document.getElementById('error-descripcion')

    // Validaciones
    validarText(tipoIn, error_tipo)
    validarText(descripcionIn, error_descripcion)

    if (!tipo || !descripcion) {
        alert('Por favor, complete todos los campos.')
        return
    }

    const campos = document.querySelectorAll('input')
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Insertar en Supabase
    await insertarSistema(tipo, descripcion)
})

// Cargar los sistemas al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarSistemas()
})
