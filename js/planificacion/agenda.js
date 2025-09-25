
import supabase from '../supabase/supabase-client.js'

// Declaración de variables
let tasks = [];
let ganttChart;
let calendar;
let calendarInicializado = false;

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
    cargarDepartamentos('departamentoP')
})

async function cargarTareas() {
    const departamentoFiltro = document.getElementById('departamentoP').value;
    
    try {
        // Obtener tareas que tienen proveedor asignado
        const { data: tareasConProveedor, error: errorProveedor } = await supabase
            .from('tarea_proveedor')
            .select('id_tarea');
            
        if (errorProveedor) throw errorProveedor;
        
        if (tareasConProveedor.length === 0) {
            tasks = [];
            return [];
        }
        
        // Obtener id de tareas con proveedor
        const tareaIds = tareasConProveedor.map(tp => tp.id_tarea);
        
        // Obtener información completa de las tareas
        const { data: tareasData, error: errorTareas } = await supabase
            .from('tareas')
            .select(`
                *,
                unidades:id_unidad(
                    nombre,
                    id_empleado (
                        nombre,
                        departamentos (nombre, id_departamento)
                    )
                ),
                sistemas:id_sistema(tipo),
                periodicidad:id_periodicidad(nombre),
                tarea_proveedor!tarea_proveedor_id_tarea_fkey (
                    id_proveedor,
                    proveedores (id_proveedor, nombre)
                ),
                calendario!calendario_id_tarea_fkey (
                    fecha_programada,
                    estado
                )
            `)
            .in('id_tarea', tareaIds);
            
        if (errorTareas) throw errorTareas;
        
        // Convertir el formato de Supabase al formato que necesita el Gantt
        const tareasProcesadas = tareasData.flatMap(tarea => {
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor[0] 
                ? tarea.tarea_proveedor[0].proveedores.nombre 
                : 'Sin asignar';
                
            const departamento = tarea.unidades?.id_empleado?.departamentos?.nombre || 'N/A';
            const idDepartamento = tarea.unidades?.id_empleado?.departamentos?.id_departamento || null;

            // Generar una fila por cada registro de calendario
            return tarea.calendario.map(cal => ({
                id: 'T' + tarea.id_tarea + '_' + cal.fecha_programada,
                name: tarea.nombre,
                start: cal.fecha_programada,
                end: cal.fecha_programada,
                description: tarea.descripcion,
                unidad: tarea.unidades ? tarea.unidades.nombre : 'N/A',
                departamento: departamento,
                id_departamento: idDepartamento, // Para filtrar
                sistema: tarea.sistemas ? tarea.sistemas.tipo : 'N/A',
                responsable: proveedor,
                periodicidad: tarea.periodicidad ? tarea.periodicidad.nombre : 'N/A',
                progress: 100,
                estado: cal.estado,
                id_original: tarea.id_tarea
            }));
        });

        tareasProcesadas.sort((a, b) => new Date(a.fecha_programada) - new Date(b.fecha_programada));
        
        // Aplicar filtro de departamento
        let tareasFiltradas = tareasProcesadas;
        if (departamentoFiltro && departamentoFiltro !== '0') {
            tareasFiltradas = tareasProcesadas.filter(t => t.id_departamento == departamentoFiltro);
        }
        
        // Mantener tasks actualizado
        tasks = tareasFiltradas;
        
        return tareasFiltradas;
        
    } catch (error) {
        console.error('Error cargando tareas:', error);
        tasks = [];
        return [];
    }
}

// ---------- GANTT ---------- //
// Inicializar Gantt
export async function generarGantt() {
    // Cargar tareas antes de inicializar
    await cargarTareas();
    
    const ganttContainer = document.getElementById('gantt_diagrama');
    if (ganttContainer && tasks.length > 0) {
        ganttChart = new Gantt(ganttContainer, tasks, {
            view_mode: 'Day',
            language: 'es'
        });
        
        const ganttTab = document.querySelector('#gantt-tab');
        if (ganttTab) {
            ganttTab.addEventListener('shown.bs.tab', function () {
                setTimeout(() => {ganttChart.change_view_mode('Day')}, 100);
            });
        }
    }
}

// Cambiar modo de vista del Gantt
function cambiarView(mode) {
    if (ganttChart) {
        ganttChart.change_view_mode(mode);
    }
}

document.getElementById('dia-tab')?.addEventListener('click', function() {
    cambiarView('Day')
});
document.getElementById('sem-tab')?.addEventListener('click', function() {
    cambiarView('Week')
});
document.getElementById('mes-tab')?.addEventListener('click', function() {
    cambiarView('Month')
});

// Función para aplicar filtro a ambos diagramas
async function aplicarFiltro() {
    try {
        // Recargar tareas primero
        await cargarTareas();
        
        // Recargar calendario
        if (calendar) {
            calendar.refetchEvents();
        }
        
        // Recargar Gantt solo si hay tareas
        if (ganttChart && tasks.length > 0) {
            const ganttContainer = document.getElementById('gantt_diagrama');
            if (ganttContainer) {
                ganttContainer.innerHTML = '';
                ganttChart = new Gantt(ganttContainer, tasks, {
                    view_mode: 'Day',
                    language: 'es'
                });
            }
        } else if (tasks.length === 0) {
            // Limpiar Gantt si no hay tareas
            const ganttContainer = document.getElementById('gantt_diagrama');
            if (ganttContainer) {
                ganttContainer.innerHTML = '<p>No hay tareas para mostrar</p>';
            }
        }
    } catch (error) {
        console.error('Error aplicando filtro:', error);
    }
}

// ---------- CALENDARIO ---------- //
// Inicializar el calendario
export async function generarCalendario() {
    // Cargar departamentos en el filtro
    await cargarDepartamentos('departamentoP');
    
    const calendarEl = document.getElementById('calendario-element');
    if (calendarEl) {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            events: function(fetchInfo, successCallback, failureCallback) {
                cargarTareas().then(tasks => {
                    const eventos = tasks.map(task => {
                        return {
                            id: task.id,
                            title: task.name,
                            start: task.start,
                            end: task.end,
                            description: task.description,
                            unidad: task.unidad,
                            departamento: task.departamento,
                            sistema: task.sistema,
                            responsable: task.responsable,
                            periodicidad: task.periodicidad,
                            estado: task.estado,
                            color: generarColor(task)
                        };
                    });
                    successCallback(eventos);
                }).catch(error => {
                    console.error('Error cargando eventos:', error);
                    successCallback([]);
                });
            },
            eventClick: function(info) {
                const task = tasks.find(t => t.id === info.event.id);
                if (task) {
                    abrirModal(task);
                }
                info.jsEvent.preventDefault();
            },
            editable: false,
            eventResizableFromStart: false
        });
        calendar.render();
        calendarInicializado = true;
    }
    
    // Botón de filtrar
    document.getElementById('btn_genP').addEventListener('click', aplicarFiltro);
}

// Función para obtener color basado en el estado del calendario
function generarColor(task) {
    const estadoTarea = obtenerEstadoTarea(task.id_original);
    
    switch(estadoTarea) {
        case 'Pendiente':
            return '#dcd135ff';
        case 'Realizada':
            return '#28a745';
        case 'Cancelada':
            return '#6c757d';
        default:
            return '#17a2b8';
    }
}

// Función auxiliar para obtener el estado de una tarea desde los datos
function obtenerEstadoTarea(idTarea) {
    const tareaCompleta = tasks.find(t => t.id_original === idTarea);
    if (tareaCompleta && tareaCompleta.estado) {
        return tareaCompleta.estado;
    }
    return 'Pendiente'; // Por defecto
}

// Mostrar detalles de la tarea en el modal
function abrirModal(task) {
    
    const eventoModal = document.getElementById('evento_modal');
    
    if (eventoModal) {
        eventoModal.innerHTML = 
            `<div class="card mb-3">
                <div class="card-header">
                    <div class="row">
                        <div class="col-6">
                            <strong>ID:</strong> ${task.id}
                        </div>
                        <div class="col-6 text-end">
                            <p class="info"><strong>Responsable:</strong> ${task.responsable}</p>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="info"><strong>Nombre:</strong> ${task.name}</p>
                    <p class="info"><strong>Fecha programada:</strong> ${task.start}</p>
                    <p class="info"><strong>Unidad:</strong> ${task.unidad}</p>
                    <div class="row">
                        <div class="col-6">
                            <p class="info"><strong>Sistema:</strong> ${task.sistema}</p>
                        </div>
                        <div class="col-6">
                            <p class="info"><strong>Departamento:</strong> ${task.departamento}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="info"><strong>Periodicidad:</strong> ${task.periodicidad}</p>
                        </div>
                        <div class="col-6">
                            <p class="info"><strong>Estado:</strong> ${task.estado}</p>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Mostrar el modal
        const modalElement = document.getElementById('agenda_modal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    generarCalendario();
});

// Función para cerrar el modal
document.addEventListener('hide.bs.modal', function(e) {
    // Remover el foco de cualquier elemento antes de cerrar
    if (document.activeElement) {
        document.activeElement.blur();
    }
});