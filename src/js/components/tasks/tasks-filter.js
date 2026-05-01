// Servicios Supabase
import { getTasks } from '../../services/tasks-service.js'; 
import { renderTasksTable } from './tasks-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';

let allTasks = [];

// Cargar las periodicidades en el select del filtro
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('periodicity-filter', 'mant_periodicidad', 'id_periodicidad', 'nombre');
});

// Función de filtrado por valores seleccionados
export async function tasksFilter() {
    const priorityFilter = document.getElementById('priority-filter').value;
    const periodicityFilter = document.getElementById('periodicity-filter').value;

    // Obtener tareas
    allTasks = await getTasks();
        if (!allTasks) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = periodicityFilter === '0' && priorityFilter === '0';

    if (filterClean) {
        renderTasksTable(allTasks);
        return allTasks;
    }

    // Aplicar filtros
    const filtered = allTasks.filter(t => {
        const priorityOk = priorityFilter === '0' || t.prioridad == priorityFilter;
        const periodicityOk = periodicityFilter === '0' || t.id_periodicidad == periodicityFilter;

        return priorityOk && periodicityOk;
    });

    renderTasksTable(filtered);

    return allTasks;
}
