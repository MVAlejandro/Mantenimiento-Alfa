
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from './supabase/supabase-client.js'
import { validarCamposInvalidos } from "../js/validaciones/validar_campos.js"
import { validarText } from "./validaciones/regex.js"

// Función centralizada para obtener sistemas
async function obtenerSistemasCompletos() {
    const { data, error } = await supabase
        .from('sistemas')
        .select('*');
    
    if (error) {
        console.error('Error obteniendo sistemas:', error);
        throw error;
    }
    
    return data.map(sistema => ({
        id_sistema: sistema.id_sistema,
        tipo: sistema.tipo,
        descripcion: sistema.descripcion
    }));
}

// Función para insertar un nuevo sistema en Supabase
async function insertarSistema(sistema) {
    const { data, error } = await supabase.from('sistemas').insert([sistema])

    if (error) {
        console.error(error)
        alert('Error al guardar el sistema: ' + error.message)
    } else {
        alert('Sistema agregado con éxito')
        generarTablaSistemas() // actualizar listado
        // Limpiar formulario
        document.querySelector('form').reset()
    }
}

// Función de filtrado
async function cargarFiltro() {
    const selectTipo = document.getElementById('filtro_tipo');

    // Limpiar opciones anteriores
    selectTipo.innerHTML = '';

    // Obtener sistemas usando la función centralizada
    const sistemas = await obtenerSistemasCompletos();
    if (!sistemas) return;

    let opciones = [];

    // Obtener valores únicos según el tipo
    opciones = sistemas.map(s => s.tipo);

    // Eliminar duplicados y valores vacíos
    const opcionesUnicas = [...new Set(opciones)].filter(v => v);

    // Agregar opciones al select
    selectTipo.innerHTML = '<option value="0">Todos</option>';
    opcionesUnicas.forEach(opcion => {
        const optionEl = document.createElement('option');
        optionEl.value = opcion;
        optionEl.textContent = opcion;
        selectTipo.appendChild(optionEl);
    });
};

// Función al dar click en botón de filtrado
document.getElementById('btn_filtro').addEventListener('click', async function () {
    const tipo = document.getElementById('filtro_tipo').value;
    const textoBusqueda = document.getElementById('filtro_buscar').value.trim().toLowerCase();

    // Obtener sistemas usando la función centralizada
    const sistemasProcesados = await obtenerSistemasCompletos();
    if (!sistemasProcesados) return;

    // Si no hay filtros activos, mostrar todo
    const sinFiltros =
        tipo === '0' && textoBusqueda === '';

    if (sinFiltros) {
        generarTablaSistemas(sistemasProcesados);
        return;
    }

    // Aplicar filtros
    const filtrados = sistemasProcesados.filter(s => {
        let cumpleSelect = true;
        let cumpleBusqueda = true;

        // Filtro por select dinámico
        if (tipo !== '0') {
            const campo = s.tipo?.toString().toLowerCase();
            cumpleSelect = campo === tipo.toLowerCase();
        }

        // Filtro por búsqueda libre
        if (textoBusqueda) {
            cumpleBusqueda = Object.values(s).some(valor =>
                valor?.toString().toLowerCase().includes(textoBusqueda)
            );
        }

        return cumpleSelect && cumpleBusqueda;
    });

    generarTablaSistemas(filtrados);
});

// Función para cargar los sistemas desde Supabase en la tabla
function generarTablaSistemas(sistemas) {
    const tbody = document.querySelector('#tabla_sistemas tbody');
    tbody.innerHTML = '';

    if (!sistemas || sistemas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay sistemas que coincidan con los filtros</td></tr>`;
        return;
    }

    sistemas.forEach(sistema => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${sistema.id_sistema}</th>
            <td>${sistema.tipo}</td>
            <td>${sistema.descripcion}</td>
            <td><button type="button" class="btn btn-primary sistema-btn" 
                    data-bs-toggle="modal" 
                    data-bs-target="#sistema_modal"
                    data-sistema='${JSON.stringify(sistema)}'>
                    Editar
                </button></td>
        </tr>`;
    });
}

// Evento al dar click al botón Agregar Sistema
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
    const nuevoSistema = { id_sistema, tipo, descripcion}
    await insertarSistema(nuevoSistema)
})

// Cargar los sistemas al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    cargarFiltro()

    const sistemasProcesadas = await obtenerSistemasCompletos();
    if (sistemasProcesadas) {
        generarTablaSistemas(sistemasProcesadas);
    }
})

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('sistema-btn')) {
        const sistemaData = JSON.parse(e.target.getAttribute('data-sistema'));
        cargarDatosEnModal(sistemaData);
    }
});

// Función para cargar datos en el modal
function cargarDatosEnModal(sistema) {
    // Campos no editables (solo lectura)
    document.getElementById('edit_id_sistema').value = sistema.id_sistema;
    document.getElementById('edit_id_display').value = sistema.id_sistema;
    
    // Campos editables
    document.getElementById('edit_tipo').value = sistema.tipo;
    document.getElementById('edit_descripcion').value = sistema.descripcion;
}

// Función para guardar cambios
document.getElementById('btn_guardar_cambios').addEventListener('click', async function() {
    const id_sistema = document.getElementById('edit_id_sistema').value;
    const tipo = document.getElementById('edit_tipo').value;
    const descripcion = document.getElementById('edit_descripcion').value;

    // Validar campos requeridos
    if (!tipo || !descripcion) {
        alert('Por favor, complete todos los campos obligatorios');
        return;
    }

    // Actualizar en Supabase
    const { data, error } = await supabase
        .from('sistemas')
        .update({ 
            tipo: tipo, 
            descripcion: descripcion 
        })
        .eq('id_sistema', id_sistema);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el sistema: ' + error.message);
    } else {
        alert('Sistema actualizado correctamente');
        generarTablaSistemas();
        bootstrap.Modal.getInstance(document.getElementById('sistema_modal')).hide();
    }
});
