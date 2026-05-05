// Servicios Supabase
import { getFullTasks } from '../../services/calendar-service.js'; 

let allTasks = [];

// Función de filtrado por valores seleccionados
export async function tasksReportFilter() {
    // Obtener valores de filtros
    const dateStart = document.getElementById('date-start').value;
    const dateEnd = document.getElementById('date-end').value;
    const statusFilter = document.getElementById('status-report').value;

    // Obtener tareas programadas
    allTasks = await getFullTasks();
        if (!allTasks) return;

    // Aplicar filtros
    const filtered = allTasks.filter(t => {
        const taskDate = new Date(t.fecha_programada);

        const statusOk = statusFilter === '0' || t.estado == statusFilter;
        const startOk = !dateStart || taskDate >= new Date(dateStart);
        const endOk = !dateEnd || taskDate <= new Date(dateEnd);

        return statusOk && startOk && endOk;
    });

    return filtered;
}

// Función para crear la tabla del reporte
export async function renderReportTable(allTasks) {
    const tbody = document.querySelector('#report-table tbody');

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allTasks || allTasks.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="7">No hay información para mostrar</td></tr>`;
        return;
    }

    allTasks.forEach(tarea => {
        tbody.innerHTML += 
        `<tr>
            <td class="task-date p-1 ps-4 fw-bold">${tarea.fecha_programada}</td>
            <td class="p-1">
                <p class="task-name">${tarea.tarea}</p>
                <p class="task-departament">${tarea.departamento}</p>
            </td>
            <td class="p-1">
                <p class="task-active">${tarea.activo}</p>
                <p class="task-system fst-italic">${tarea.sistema}</p>
            </td>
            <td class="p-1">
                <p class="task-supplier">${tarea.responsable}</p>
                <p class="task-departament fst-italic">${tarea.puesto_responsable}</p>
            </td>
            <td class="task-priority p-1">${tarea.prioridad}</td>
            <td class="task-status p-1">${tarea.estado}</td>
            <td class="task-observations p-1">${tarea.observaciones || "NA"}</td>
        </tr>`;
    });
}

// Función para generar el reporte completo
export async function tasksReport(event) {
    event.preventDefault();

    const btn = event.target.closest('#btn-generate');

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = 'Generando...';
        }

        const filtered = await tasksReportFilter();

        renderReportTable(filtered);

    } catch (error) {
        console.error(error);
        Swal.fire({
            title: 'Atención',
            text: 'Ocurrió un error al generar el reporte.',
            icon: 'warning'
        });
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 'Generar';
        }
    }
}