
import supabase from '../supabase/supabase-client.js'

// ---------- SUPERVISIÓN ----------//
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

// Función para cargar proveedores en el select
async function cargarProveedores(provElement) {
    const { data, error } = await supabase.from('proveedores').select('id_proveedor, nombre');

    const selectProv = document.getElementById(provElement);
    selectProv.innerHTML = '<option value="0">Todos</option>';

    if (error) {
        console.error("Error cargando proveedores:", error);
        return;
    }

    data.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id_proveedor;
        option.textContent = prov.nombre;
        selectProv.appendChild(option);
    });
}

// Cargar los selects al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos('departamentoS')
    cargarProveedores('proveedorS')
})

export function generarTablaSuper(tareas) {
    let tbody = document.querySelector("#supervision tbody");
    tbody.innerHTML = "";

    if (tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay tareas en este rango</td></tr>`;
        return;
    }

    tareas.forEach(t => {
        // Mostrar checkbox solo si está pendiente, de lo contrario mostrar el estado
        const celdaEstado = t.estado === 'Pendiente' 
            ? `<td class="text-center"><input type="checkbox"></td>`
            : `<td class="text-center">${t.estado}</td>`;

        tbody.innerHTML += 
        `<tr>
            <th scope="row">${t.fecha_programada || 'Sin fecha'}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.departamento}</td>
            <td>${t.nombre_proveedor}</td>
            <td></td>
            ${celdaEstado}
            <td>________________</td>
        </tr>`;
    });
}


// ---------- REPORTE ----------//
// Cargar los departamentos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos('departamentoR')
    cargarProveedores('proveedorR')
})

export function generarTablaReporte(tareas) {
    let tbody = document.querySelector("#reporte_tabla tbody");
    tbody.innerHTML = "";

    if (tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8">No hay tareas que coincidan con los filtros</td></tr>`;
        return;
    }

    tareas.forEach(t => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${t.fecha_programada || 'Sin fecha'}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.departamento}</td>
            <td>${t.nombre_proveedor}</td>
            <td>${t.estado}</td>
            <td>${t.refacciones}</td>
            <td>${t.observaciones || 'Sin observaciones'}</td>
        </tr>`;
    });
}
