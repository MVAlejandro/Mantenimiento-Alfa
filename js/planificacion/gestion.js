
import supabase from '../supabase/supabase-client.js'

// ---------- GESTIÓN ---------- //
// Función para cargar departamentos en el select
async function cargarDepartamentos(deptoElement) {
    const { data, error } = await supabase.from('departamentos').select('id_departamento, nombre');

    const selectDepto = document.getElementById(deptoElement);
    selectDepto.innerHTML = '<option value="0">Todos</option>';

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

// Cargar los departamentos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos('departamentoG')
})

export async function generarGestion() {
    const inicioInput = document.getElementById('fechaInicioG').value;
    const finInput = document.getElementById('fechaFinG').value;
    const departamentoFiltro = document.getElementById('departamentoG').value;
    
    // Verificar si los filtros están vacíos
    if (!inicioInput && !finInput && departamentoFiltro === '0') {
        generarTablaGestion([]);
        return;
    }

    const inicio = inicioInput ? new Date(inicioInput) : new Date(NaN);
    const fin = finInput ? new Date(finInput) : new Date(NaN);

    try {
        // Obtener solo tareas pendientes con proveedor asignado
        const { data: tareasData, error } = await supabase
            .from('tareas')
            .select(`
                *,
                unidades:id_unidad(
                    nombre,
                    id_empleado (
                        nombre,
                        departamentos (nombre)
                    )
                ),
                tarea_proveedor!tarea_proveedor_id_tarea_fkey (
                    id_proveedor,
                    proveedores (id_proveedor, nombre)
                ),
                calendario!calendario_id_tarea_fkey (
                    fecha_programada,
                    estado
                )
            `)
            .not('calendario', 'is', null) // Solo tareas con calendario
            .not('tarea_proveedor', 'is', null) // Solo tareas con proveedor
            .eq('calendario.estado', 'Pendiente'); // Solo tareas pendientes

        if (error) throw error;

        // Expandir cada registro del calendario
        const tareasProcesadas = tareasData.flatMap(tarea => {
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor.length > 0
                ? tarea.tarea_proveedor[0].proveedores.nombre
                : 'Sin asignar';

            const departamento = tarea.unidades?.id_empleado?.departamentos?.nombre || 'N/A';

            // Generar un registro por cada fila del calendario pendiente
            return tarea.calendario
                .filter(cal => cal.estado === 'Pendiente') // Filtrar solo pendientes
                .map(cal => ({
                    id_tarea: tarea.id_tarea,
                    nombre: tarea.nombre,
                    id_unidad: tarea.unidades ? tarea.unidades.nombre : tarea.id_unidad,
                    departamento,
                    id_proveedor: proveedor,
                    fecha_programada: cal.fecha_programada,
                    estado: cal.estado
                }));
        });

        // Filtrar por fechas y departamento
        let tareasFiltradas = tareasProcesadas;
        
        if (inicioInput || finInput || departamentoFiltro !== '0') {
            tareasFiltradas = tareasProcesadas.filter(t => {
                // Filtro por fechas
                let cumpleFechas = true;
                if (t.fecha_programada) {
                    const fecha = new Date(t.fecha_programada);
                    cumpleFechas = (!isNaN(inicio) ? fecha >= inicio : true) &&
                                  (!isNaN(fin) ? fecha <= fin : true);
                }
                
                // Filtro por departamento
                const cumpleDepartamento = departamentoFiltro === '0' || t.departamento === departamentoFiltro;
                
                return cumpleFechas && cumpleDepartamento;
            });
        }

        generarTablaGestion(tareasFiltradas);

    } catch (error) {
        console.error('Error cargando tareas para gestión:', error);
        generarTablaGestion([]);
    }
}

function generarTablaGestion(tareas) {
    const tbody = document.querySelector("#gestion tbody");
    tbody.innerHTML = "";

    if (!tareas || tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No hay tareas pendientes en este rango</td></tr>`;
        return;
    }

    tareas.forEach((t) => {
        const idTarea = t.id_tarea;
        tbody.innerHTML += `
        <tr data-id-tarea="${idTarea}">
            <th scope="row">${t.fecha_programada || 'Sin fecha'}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.departamento}</td>
            <td>${t.id_proveedor}</td>
            <td><button type="button" class="btn btn-primary tarea-btn" data-bs-toggle="modal" data-bs-target="#gestion_modal">Gestionar tarea</button></td>
        </tr>`;
    });
}

// Variable global para la tarea actual
let tareaActual = null;

// Abrir modal de gestión
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Gestionar tarea') {
        const fila = e.target.closest('tr');
        tareaActual = fila.dataset.idTarea;

        // Limpiar y resetear campos
        resetearModal();
        
        // Agregar primer conjunto de campos de refacción, si no está cancelado
        agregarRefaccion();

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('gestion_modal'));
        modal.show();
    }
});

// Resetear modal a estado inicial
function resetearModal() {
    document.getElementById('fechaRealizada').value = '';
    document.getElementById('estado').value = '0';
    document.getElementById('observaciones').value = '';
    document.getElementById('refacciones-container').innerHTML = '';
    
    // Mostrar sección de refacciones por defecto
    document.querySelector('.mb-3:nth-child(3)').style.display = 'block';
    document.getElementById('btn-addRef').style.display = 'block';
}

// Mostrar refacciones según estado seleccionado
document.getElementById('estado').addEventListener('change', function() {
    const estado = this.value;
    const seccionRefacciones = document.querySelector('.mb-3:nth-child(3)');
    const btnAgregarRef = document.getElementById('btn-addRef');
    
    if (estado === 'Cancelada') {
        // Ocultar refacciones para estado Cancelada
        seccionRefacciones.style.display = 'none';
        btnAgregarRef.style.display = 'none';
    } else {
        // Mostrar refacciones para los demás estados
        seccionRefacciones.style.display = 'block';
        btnAgregarRef.style.display = 'block';
    }
});

// Función para agregar campos de refacción
function agregarRefaccion() {
    const estado = document.getElementById('estado').value;
    if (estado === 'Cancelada') return;
    
    const container = document.getElementById("refacciones-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `refaccion_${Date.now()}_${index}`;
    
    const nuevo = document.createElement("div");
    nuevo.className = "row mb-2 refaccion-item";
    nuevo.innerHTML = 
    `<div class="col-6">
        <select class="form-select select-refaccion" 
                id="${uniqueId}_select" 
                name="${uniqueId}_select"
                data-index="${index}">
            <option value="">Seleccionar refacción</option>
        </select>
    </div>
    <div class="col-4">
        <input type="number" 
               class="form-control input-cantidad" 
               id="${uniqueId}_cantidad" 
               name="${uniqueId}_cantidad"
               placeholder="Cantidad" 
               data-index="${index}">
    </div>
    <div class="col-2 d-flex align-items-center">
        <button type="button" class="btn btn-danger btn-remove" data-index="${index}">×</button>
    </div>`;

    container.appendChild(nuevo);
    cargarOpcionesRefacciones(nuevo.querySelector('.select-refaccion'));
}

// Cargar opciones de refacciones
async function cargarOpcionesRefacciones(selectElement) {
    const { data: refacciones, error } = await supabase.from("refacciones").select("*");
    if (!error) {
        refacciones.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id_refaccion;
            option.textContent = r.nombre;
            selectElement.appendChild(option);
        });
    }
}

// Agregar más refacciones
document.getElementById('btn-addRef').addEventListener('click', function() {
    agregarRefaccion();
});

// Eliminar campos de refacción
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-remove')) {
        e.target.closest('.refaccion-item').remove();
    }
});

// Guardar toda la gestión
document.getElementById('btn_addRef').addEventListener('click', async function() {
    if (!tareaActual) return;

    const fechaRealizada = document.getElementById('fechaRealizada').value;
    const estado = document.getElementById('estado').value;
    const observaciones = document.getElementById('observaciones').value;

    // Validaciones
    if (estado !== '0' && !fechaRealizada) {
        alert('Debe ingresar la fecha realizada');
        return;
    }

    try {
        // Actualizar el calendario
        if (estado !== '0') {
            const { error: errorCalendario } = await supabase
                .from('calendario')
                .update({
                    fecha_realizada: fechaRealizada,
                    estado: estado,
                    observaciones: observaciones
                })
                .eq('id_tarea', tareaActual)
                .eq('estado', 'Pendiente');

            if (errorCalendario) throw errorCalendario;
        }

        // Guardar refacciones solo si no está cancelado
        if (estado !== 'Cancelada') {
            const refaccionesItems = document.querySelectorAll('.refaccion-item');
            const refaccionesData = [];

            for (const item of refaccionesItems) {
                const select = item.querySelector('.select-refaccion');
                const input = item.querySelector('.input-cantidad');
                
                if (select.value && input.value) {
                    refaccionesData.push({
                        id_tarea: parseInt(tareaActual),
                        id_refaccion: select.value,
                        cantidad: parseFloat(input.value)
                    });
                }
            }

            if (refaccionesData.length > 0) {
                const { error: errorRefacciones } = await supabase
                    .from('tarea_refaccion')
                    .insert(refaccionesData);
                if (errorRefacciones) throw errorRefacciones;
            }
        }

        alert('Gestión guardada correctamente');
        const modal = bootstrap.Modal.getInstance(document.getElementById('gestion_modal'));
        modal.hide();

        // Recargar la tabla de gestión
        generarGestion();

    } catch (error) {
        console.error('Error guardando gestión:', error);
        alert('Error al guardar la gestión');
    }
});

// Función para cerrar el modal
document.addEventListener('hidden.bs.modal', function() {
    // Eliminar manualmente el backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Restaurar el estilo del body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Limpiar el contenido del modal
    resetearModal();
});
