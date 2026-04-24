// Servicios Supabase
import { getSpares } from '../../services/spares-service.js'; 
import { renderSparesTable } from './spares-table.js'; 

let allSpares = [];

// Función de filtrado por búsqueda
export async function sparesFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    // Obtener clientes
    allSpares = await getSpares();
        if (!allSpares) return;

    // Si no hay filtros activos, mostrar todo
    if (searchText === '') {
        renderSparesTable(allSpares);
        return;
    }

    // Aplicar filtros
    const filtered = allSpares.filter(s => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || s.nombre?.toString().toLowerCase().includes(searchText) || s.codigo?.toString().toLowerCase().includes(searchText);;

        return searchOk;
    });

    renderSparesTable(filtered);
}
