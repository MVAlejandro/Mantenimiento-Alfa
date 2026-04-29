// Servicios Supabase
import { getActives } from '../../services/actives-service.js'; 
import { renderActivesTable } from './actives-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';

let allActives = [];

// Cargar los departamentos en el select del filtro
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('departament-filter', 'rh_departamentos', 'id_departamento', 'nombre');
});

// Función de filtrado por valores seleccionados
export async function activesFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    const departamentFilter = document.getElementById('departament-filter').value;

    // Obtener activos
    allActives = await getActives();
        if (!allActives) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = departamentFilter === '' && searchText === '';

    if (filterClean) {
        renderActivesTable(allActives);
        return allActives;
    }

    // Aplicar filtros
    const filtered = allActives.filter(a => {
        const searchOk = searchText === '' || a.nombre?.toString().toLowerCase().includes(searchText) || a.modelo?.toString().toLowerCase().includes(searchText);
        const departamentOk = departamentFilter === '0' || a.id_departamento == departamentFilter;

        return searchOk && departamentOk;
    });

    renderActivesTable(filtered);

    return allActives;
}
