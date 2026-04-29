// Servicios Supabase
import { getSuppliers } from '../../services/suppliers-service.js';
import { renderSuppliersList } from './suppliers-list.js'; 

let allSuppliers = [];

// Función de filtrado por búsqueda
export async function suppliersFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    // Obtener proveedores
    allSuppliers = await getSuppliers();
        if (!allSuppliers) return;

    // Si no hay filtros activos, mostrar todo
    if (searchText === '') {
        renderSuppliersList(allSuppliers);
        return;
    }

    // Aplicar filtros
    const filtered = allSuppliers.filter(s => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || s.nombre?.toString().toLowerCase().includes(searchText) || s.empresa?.toString().toLowerCase().includes(searchText);;

        return searchOk;
    });

    renderSuppliersList(filtered);
}
