
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

// Cargar los departamentos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos('departamentoS')
})

export async function generarSupervision() {
    const inicioInput = document.getElementById('fechaInicioS').value;
    const finInput = document.getElementById('fechaFinS').value;
    const departamentoFiltro = document.getElementById('departamentoS').value;
    
    // Verificar si los filtros están vacíos
    if (!inicioInput && !finInput && departamentoFiltro === '0') {
        generarTablaSuper([]);
        return;
    }

    const inicio = inicioInput ? new Date(inicioInput) : new Date(NaN);
    const fin = finInput ? new Date(finInput) : new Date(NaN);

    try {
        // Obtener tareas con proveedor asignado y calendario
        const { data: tareasData, error } = await supabase
            .from('tareas')
            .select(`
                *,
                unidades:id_unidad(
                    nombre,
                    id_empleado (
                        nombre,
                        departamentos (nombre)
                    )
                ),
                tarea_proveedor!tarea_proveedor_id_tarea_fkey (
                    id_proveedor,
                    proveedores (id_proveedor, nombre)
                ),
                calendario!calendario_id_tarea_fkey (
                    fecha_programada,
                    estado
                )
            `)
            .not('calendario', 'is', null) // Solo tareas con calendario
            .not('tarea_proveedor', 'is', null); // Solo tareas con proveedor

        if (error) throw error;

        // Expandir cada calendario como fila
        const tareasProcesadas = tareasData.flatMap(tarea => {
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor.length > 0
                ? tarea.tarea_proveedor[0].proveedores.nombre
                : 'Sin asignar';

            const departamento = tarea.unidades?.id_empleado?.departamentos?.nombre || 'N/A';

            return tarea.calendario.map(cal => ({
                id_tarea: tarea.id_tarea,
                nombre: tarea.nombre,
                id_unidad: tarea.unidades ? tarea.unidades.nombre : tarea.id_unidad,
                departamento,
                id_proveedor: proveedor,
                fecha_programada: cal.fecha_programada,
                estado: cal.estado
            }));
        });

        // Filtrar por fechas y departamento
        let tareasFiltradas = tareasProcesadas;
        
        if (inicioInput || finInput || departamentoFiltro !== '0') {
            tareasFiltradas = tareasProcesadas.filter(t => {
                // Filtro por fechas
                let cumpleFechas = true;
                if (t.fecha_programada) {
                    const fecha = new Date(t.fecha_programada);
                    cumpleFechas = (!isNaN(inicio) ? fecha >= inicio : true) &&
                                  (!isNaN(fin) ? fecha <= fin : true);
                }
                
                // Filtro por departamento
                const cumpleDepartamento = departamentoFiltro === '0' || t.departamento === departamentoFiltro;
                
                return cumpleFechas && cumpleDepartamento;
            });
        }

        generarTablaSuper(tareasFiltradas);

    } catch (error) {
        console.error('Error cargando tareas para supervisión:', error);
        generarTablaSuper([]);
    }
}

function generarTablaSuper(tareas) {
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
            <td>${t.id_proveedor}</td>
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
})

export async function generarReporte() {
    const inicioInput = document.getElementById('fechaInicioR').value;
    const finInput = document.getElementById('fechaFinR').value;
    const estadoFiltro = document.getElementById('estadoR').value;
    const departamentoFiltro = document.getElementById('departamentoR').value;
    
    // Verificar si todos los filtros están vacíos
    if (!inicioInput && !finInput && estadoFiltro === '0' && departamentoFiltro === '0') {
        generarTablaReporte([]);
        return;
    }

    const inicio = inicioInput ? new Date(inicioInput) : new Date(NaN);
    const fin = finInput ? new Date(finInput) : new Date(NaN);

    try {
        // Obtener solo tareas asignadas
        const { data: tareasData, error } = await supabase
            .from('tareas')
            .select(`
                *,
                unidades:id_unidad(
                    nombre,
                    id_empleado (
                        nombre,
                        departamentos (nombre)
                    )
                ),
                tarea_proveedor!tarea_proveedor_id_tarea_fkey (
                    id_proveedor,
                    proveedores (id_proveedor, nombre)
                ),
                calendario!calendario_id_tarea_fkey (
                    fecha_programada,
                    fecha_realizada,
                    estado,
                    observaciones
                ),
                tarea_refaccion!tarea_refaccion_id_tarea_fkey (
                    cantidad,
                    refacciones (nombre)
                )
            `)
            .not('calendario', 'is', null) // Solo tareas con calendario
            .not('tarea_proveedor', 'is', null); // Solo tareas asignadas

        if (error) throw error;

        // Expandir cada registro del calendario
        const tareasProcesadas = tareasData.flatMap(tarea => {
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor.length > 0
                ? tarea.tarea_proveedor[0].proveedores.nombre
                : 'Sin asignar';

            const refacciones = tarea.tarea_refaccion && tarea.tarea_refaccion.length > 0
                ? tarea.tarea_refaccion.map(tr => 
                    `${tr.refacciones.nombre} (${tr.cantidad})`
                  ).join(', ')
                : 'Ninguna';

            const departamento = tarea.unidades?.id_empleado?.departamentos?.nombre || 'N/A';

            // Generar un registro por cada fila del calendario
            return tarea.calendario.map(cal => ({
                fecha_programada: cal.fecha_programada,
                fecha_realizada: cal.fecha_realizada,
                nombre: tarea.nombre,
                id_unidad: tarea.unidades ? tarea.unidades.nombre : tarea.id_unidad,
                departamento,
                id_proveedor: proveedor,
                estado: cal.estado,
                refacciones,
                observaciones: cal.observaciones || ''
            }));
        });

        // Filtrar por fechas, estado y departamento
        let tareasFiltradas = tareasProcesadas;
        
        if (inicioInput || finInput || estadoFiltro !== '0' || departamentoFiltro !== '0') {
            tareasFiltradas = tareasProcesadas.filter(t => {
                // Filtro por fechas
                let cumpleFechas = true;
                if (t.fecha_programada) {
                    const fecha = new Date(t.fecha_programada);
                    cumpleFechas = (!isNaN(inicio) ? fecha >= inicio : true) &&
                                  (!isNaN(fin) ? fecha <= fin : true);
                }
                
                // Filtro por estado
                const cumpleEstado = estadoFiltro === '0' || t.estado === estadoFiltro;
                
                // Filtro por departamento
                const cumpleDepartamento = departamentoFiltro === '0' || t.departamento === departamentoFiltro;
                
                return cumpleFechas && cumpleEstado && cumpleDepartamento;
            });
        }

        generarTablaReporte(tareasFiltradas);

    } catch (error) {
        console.error('Error cargando reporte:', error);
        generarTablaReporte([]);
    }
}

function generarTablaReporte(tareas) {
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
            <td>${t.id_proveedor}</td>
            <td>${t.estado}</td>
            <td>${t.refacciones}</td>
            <td>${t.observaciones || 'Sin observaciones'}</td>
        </tr>`;
    });
}
