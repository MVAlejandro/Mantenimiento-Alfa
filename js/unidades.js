
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import { validarCamposInvalidos, validarSelect } from "../js/validaciones/validar_campos.js"
import { validarText, validarId, validarAño } from "./validaciones/regex.js"

// Función para cargar departamentos en el select
async function cargarDepartamentos() {
    const { data, error } = await supabase.from('departamentos').select('id_departamento, nombre');

    const selectDepto = document.getElementById('departamento');
    selectDepto.innerHTML = '<option value="0">Seleccione...</option>';

    if (error) {
        console.error("Error cargando departamentos:", error);
        return;
    }

    data.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.id_departamento;
        option.textContent = depto.nombre;
        selectDepto.appendChild(option);
    });
}

// Función para cargar empleado en el select
async function cargarEmpleados(idDepartamento) {
    const { data, error } = await supabase
        .from('empleados')
        .select('id_empleado, nombre')
        .eq('id_departamento', idDepartamento);

    const selectEmpleado = document.getElementById('empleado');
    selectEmpleado.innerHTML = '<option value="0">Seleccione...</option>';

    if (error) {
        console.error("Error cargando empleados:", error);
        return;
    }

    data.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id_empleado;
        option.textContent = emp.nombre;
        selectEmpleado.appendChild(option);
    });
}

// Detectar cambio en el select de departamento
document.getElementById('departamento').addEventListener('change', function() {
    const idDepto = this.value;
    if (idDepto !== "0") {
        cargarEmpleados(idDepto);
    } else {
        document.getElementById('empleado').innerHTML = '<option value="0">Seleccione...</option>';
    }
});

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
        descripcion,
        id_empleado (
        nombre,
        departamentos (nombre)
        )
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
                    <div class="col-6 text-end"><strong>Empleado a cargo:</strong> ${unidad.id_empleado?.nombre}</div>
                </div>
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${unidad.nombre}</p>
                <div class="row">
                    <div class="col-6"><p class="info"><strong>Modelo:</strong> ${unidad.modelo}</p></div>
                    <div class="col-6"><p class="info"><strong>Año:</strong> ${unidad.anio}</p></div>
                </div>
                <p class="info"><strong>Departamento:</strong> ${unidad.id_empleado?.departamentos?.nombre}</p>
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
    const id_empleado = document.getElementById('empleado').value

    // Referencias para validación
    const id_unidadIn = document.getElementById('id_u')
    const nombreIn = document.getElementById('nombre_u')
    const modeloIn = document.getElementById('modelo')
    const anioIn = document.getElementById('año')
    const departamentoIn = document.getElementById('departamento')
    const descripcionIn = document.getElementById('descripcion')
    const id_empleadoIn = document.getElementById('empleado')

    const error_id = document.getElementById('error-id')
    const error_nombre = document.getElementById('error-nombre')
    const error_modelo = document.getElementById('error-modelo')
    const error_año = document.getElementById('error-año')
    const error_departamento = document.getElementById('error-departamento')
    const error_descripcion = document.getElementById('error-descripcion')
    const error_empleado = document.getElementById('error-empleado')

    // Validaciones
    validarId(id_unidadIn, error_id)
    validarText(nombreIn, error_nombre)
    validarText(modeloIn, error_modelo)
    validarAño(anioIn, error_año)
    validarSelect(departamentoIn, error_departamento)
    validarText(descripcionIn, error_descripcion)
    validarSelect(id_empleadoIn, error_empleado)

    if (!id_unidad || !nombre || !modelo || !anio || !departamento || !descripcion || !id_empleado) {
        alert('Por favor, complete todos los campos para agregar la entrada.')
        return
    }

    const campos = document.querySelectorAll('input, select')
    if (!validarCamposInvalidos(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Insertar en Supabase
    const nuevaUnidad = { id_unidad, nombre, modelo, anio, descripcion, id_empleado }
    await insertarUnidad(nuevaUnidad)
})

// Cargar los empleados y unidades al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos()
    cargarUnidades()
})