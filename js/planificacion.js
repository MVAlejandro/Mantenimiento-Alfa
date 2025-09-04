
// Cargar tareas desde localStorage y adaptarlas al formato de Gantt
let tasks = [];
const tareasStorage = JSON.parse(localStorage.getItem('tareas')) || [];

// Convertir el formato de localStorage al formato que necesita el Gantt
if (tareasStorage.length > 0) {
    tasks = tareasStorage.map((tarea, index) => {
        return {
            id: 'T' + (index + 1),
            name: tarea.nombre,
            start: tarea.fecha_programada,
            end: tarea.fecha_programada,
            description: tarea.descripcion,
            unidad: tarea.id_unidad,
            sistema: tarea.id_sistema,
            responsable: tarea.id_proveedor,
            periodicidad: tarea.id_periodicidad,
            refacciones: tarea.id_refaccion
        };
    });
}

let ganttChart;
let calendar;

document.addEventListener('DOMContentLoaded', function() {
    // Establecer calendario como activo inicialmente
    setTimeout(() => {
        const calendarTab = document.querySelector('.tab[data-view="calendar-view"]');
        const ganttTab = document.querySelector('.tab[data-view="gantt-view"]');
        const calendarView = document.getElementById('calendar-view');
        const ganttView = document.getElementById('gantt-view');
        
        if (calendarTab && ganttTab && calendarView && ganttView) {
            // Desactivar todas las pestañas y vistas
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            
            // Activar la pestaña del calendario
            calendarTab.classList.add('active');
            calendarView.classList.add('active');
        }
    }, 100);
    
    initGanttChart();
    initFullCalendar();
    setupTabNavigation();
});

// Configurar la navegación por pestañas
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Desactivar todas las pestañas y vistas
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            
            // Activar la pestaña y vista seleccionada
            tab.classList.add('active');
            const viewId = tab.getAttribute('data-view');
            document.getElementById(viewId).classList.add('active');
            
            // Redimensionar el calendario cuando se muestra
            if (viewId === 'calendar-view') {
                setTimeout(() => {
                    calendar.updateSize();
                }, 100);
            }
            
            if (viewId === 'gantt-view') {
                setTimeout(() => {
                    ganttChart.change_view_mode('Day');
                    disableGanttInteractions();
                }, 100);
            }
        });
    });
}

// Inicializar el diagrama de Gantt
function initGanttChart() {
    const ganttContainer = document.getElementById('gantt-container');
    ganttChart = new Gantt(ganttContainer, tasks, {
        on_click: function(task) {
            showTaskDetails(task);
        },
        on_date_change: function(task, start, end) {
            updateTaskDates(task, start, end);
            refreshCalendar();
        },
        view_mode: 'Day',
        language: 'es',
        custom_popup_html: null, // Desactiva el popup de edición
        bar_click: function(task, e) {
            // Evita que se muestre el popup de edición al hacer clic en una barra
            e.preventDefault();
            e.stopPropagation();
        }
    });
    
    // Deshabilitar la interacción de arrastre y redimensionamiento
    disableGanttInteractions();
}

// Función para deshabilitar interacciones en el diagrama de Gantt
function disableGanttInteractions() {
    setTimeout(() => {
        // Deshabilitar eventos de arrastre en todas las barras de tareas
        const bars = document.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.pointerEvents = 'none';
            
            // Eliminar manejadores de redimensionamiento
            const handles = bar.querySelectorAll('.bar-handle');
            handles.forEach(handle => {
                handle.style.display = 'none';
            });
        });
        
        // Deshabilitar eventos en las dependencias
        const arrows = document.querySelectorAll('.arrow');
        arrows.forEach(arrow => {
            arrow.style.pointerEvents = 'none';
        });
    }, 500);
}

// Inicializar el calendario
function initFullCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
        },
        events: tasksToCalendarEvents(),
        eventClick: function(info) {
            const task = tasks.find(t => t.id === info.event.id);
            if (task) {
                showTaskDetails(task);
            }
            info.jsEvent.preventDefault();
        },
        // Hacer que los eventos del calendario no sean editables
        editable: false,
        eventResizableFromStart: false
    });
    
    calendar.render();
}

// Convertir tareas a eventos de calendario
function tasksToCalendarEvents() {
    return tasks.map(task => {
        return {
            id: task.id,
            title: task.name,
            start: task.start,
            end: task.end,
            description: task.description,
            unidad: task.unidad,
            sistema: task.sistema,
            responsable: task.responsable,
            periodicidad: task.periodicidad,
            refacciones: task.refacciones,
            color: getColorForTask(task)
        };
    });
}

// Función para obtener color
function getColorForTask(task) {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545', '#6f42c1'];
    const index = task.id.charCodeAt(1) % colors.length;
    return colors[index];
}

// Cambiar modo de vista del Gantt
function changeViewMode(mode) {
    ganttChart.change_view_mode(mode);
    // Deshabilitar interacciones después de cambiar la vista
    setTimeout(disableGanttInteractions, 100);
}

// Mostrar detalles de la tarea en el modal
function showTaskDetails(task) {
    const eventoModal = document.getElementById('evento_modal');
    
    eventoModal.innerHTML = `
        <div class="card mb-3">
            <div class="card-header">
                <div class="row">
                    <div class="col-6">
                        <strong>ID:</strong> ${task.id}
                    </div>
                    <div class="col-6 text-end">
                        <p class="info"><strong>Responsable:</strong> ${task.responsable || 'N/A'}</p>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="info"><strong>Nombre:</strong> ${task.name}</p>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Periodicidad:</strong> ${task.periodicidad || 'N/A'}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Fecha programada:</strong> ${task.start}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <p class="info"><strong>Unidad:</strong> ${task.unidad || 'N/A'}</p>
                    </div>
                    <div class="col-6">
                        <p class="info"><strong>Sistema:</strong> ${task.sistema || 'N/A'}</p>
                    </div>
                </div>
                <p class="info"><strong>Refacciones:</strong> ${task.refacciones || 'N/A'}</p>
                <p class="info"><strong>Descripción:</strong> ${task.description || 'N/A'}</p>
            </div>
        </div>
    `;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

// Actualizar fechas de tarea
function updateTaskDates(task, start, end) {
    const taskIndex = tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].start = start;
        tasks[taskIndex].end = end;
    }
}

// Actualizar el calendario
function refreshCalendar() {
    calendar.removeAllEvents();
    calendar.addEventSource(tasksToCalendarEvents());
}

// Formatear fecha como YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}