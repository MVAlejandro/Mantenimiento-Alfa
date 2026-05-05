// Servicios Supabase
import { getFullTasks } from '../../services/calendar-service.js';  
import { planningCalendar } from './planning-calendar.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';

let allTasks = [];

// Función de filtrado por valores seleccionados
export async function calendarFilter() {
    const statusFilter = document.getElementById('status-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const supplierFilter = document.getElementById('supplier-filter').value;

    // Obtener tareas programadas
    allTasks = await getFullTasks();
        if (!allTasks) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = statusFilter === '0' && priorityFilter === '0' && supplierFilter === '0';

    if (filterClean) {
        planningCalendar(allTasks);
        return allTasks;
    }

    // Aplicar filtros
    const filtered = allTasks.filter(t => {
        const statusOk = statusFilter === '0' || t.estado == statusFilter;
        const priorityOk = priorityFilter === '0' || t.prioridad == priorityFilter;
        const supplierOk = supplierFilter === '0' || t.tipo_responsable == supplierFilter;

        return statusOk && priorityOk && supplierOk;
    });

    planningCalendar(filtered);

    return filtered;
}
