
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
            refacciones: tarea.id_refaccion,
            progress: 100
        };
    });
}

let ganttChart;
let calendar;
let calendarInicializado = false;

// ---------- GANTT ---------- //
// Inicializar Gantt
export function generarGantt() {
    const ganttContainer = document.getElementById('gantt_diagrama');
    ganttChart = new Gantt(ganttContainer, tasks, {
        view_mode: 'Day',
        language: 'es'
    });
    const ganttTab = document.querySelector('#gantt-tab');

    ganttTab.addEventListener('shown.bs.tab', function () {
        setTimeout(() => {ganttChart.change_view_mode('Day')}, 100);
    });
}

// Cambiar modo de vista del Gantt
function cambiarView(mode) {
    ganttChart.change_view_mode(mode);
}

document.getElementById('dia-tab').addEventListener('click', async function(event) {
    cambiarView('Day')
});
document.getElementById('sem-tab').addEventListener('click', async function(event) {
    cambiarView('Week')
});
document.getElementById('mes-tab').addEventListener('click', async function(event) {
    cambiarView('Month')
});

// ---------- CALENDARIO ---------- //
// Inicializar el calendario
export function generarCalendario() {
        const calendarEl = document.getElementById('calendario-container');
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listMonth'
            },
            events: tareasParaCalendario(),
            eventClick: function(info) {
                const task = tasks.find(t => t.id === info.event.id);
                if (task) {
                    abrirModal(task);
                }
                info.jsEvent.preventDefault();
            },
            // Hacer que los eventos del calendario no sean editables
            editable: false,
            eventResizableFromStart: false
        });
        calendar.render();
        calendarInicializado = true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        generarCalendario(); // Ejecutar apenas cargue la página
});

// Convertir tareas a eventos de calendario
function tareasParaCalendario() {
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
            color: generarColor(task)
        };
    });
}

// Función para obtener color
function generarColor(task) {
    const colors = ['#28a745', '#17a2b8', '#ffc107', '#fd7e14', '#dc3545', '#6f42c1'];
    const index = task.id.charCodeAt(1) % colors.length;
    return colors[index];
}

// Mostrar detalles de la tarea en el modal
function abrirModal(task) {
    const eventoModal = document.getElementById('evento_modal');
    
    eventoModal.innerHTML = 
        `<div class="card mb-3">
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
        </div>`;
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('agenda_modal'));
    modal.show();
}
