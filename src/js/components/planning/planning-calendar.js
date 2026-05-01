// Servicios Supabase
import { getFullTasks } from "../../services/calendar-service"; 
import { planningModal } from "./planning-modal";

let allTasks = [];

// Función para generar el calendario con las tareas programadads
export async function planningCalendar(tasksParam = null) {
    // Obtener tareaes si no se pasa una lista filtrada
    if (tasksParam) {
        allTasks = tasksParam;
    } else {
        allTasks = await getFullTasks();
    }
console.log(allTasks);
    const container = document.getElementById('planning-calendar');
    
    // Limpiar contenedor antes de insertar
    container.innerHTML = '';

    if (!allTasks || allTasks.length === 0) {
        container.innerHTML = `<p class="ps-3">No hay información para mostrar</p>`;
        return;
    }

    let calendar = new FullCalendar.Calendar(container, {
        themeSystem: 'bootstrap5',
        height: 750,
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        events: allTasks,
        eventClick: 
            function(info) {
                // Eliminar popover
                document.querySelectorAll('.fc-popover').forEach(el => el.remove());

                planningModal(info.event.extendedProps)
            },
        eventDidMount: 
            function(info) {
                info.el.setAttribute('title', info.event.title);
            },
        editable: false,
        eventResizableFromStart: false,
        dayMaxEventRows: true,
            views: {
                timeGrid: {
                dayMaxEventRows: 5
                }
            }
    });

    // Insertar el calendario con las tareas programadads
    calendar.render();
}