
import supabase from '../supabase/supabase-client.js'

// ---------- SUPERVISIÓN ----------//
export async function generarSupervision() {
    const inicioInput = document.getElementById('fechaInicioS').value;
    const finInput = document.getElementById('fechaFinS').value;
    
    // Verificar si ambas fechas están vacías
    if (!inicioInput && !finInput) {
        generarTablaSuper([]);
        return;
    }

    const inicio = inicioInput ? new Date(inicioInput) : new Date(NaN);
    const fin = finInput ? new Date(finInput) : new Date(NaN);

    try {
        // Obtener tareas con proveedor asignado y fechas del calendario
        const { data: tareasData, error } = await supabase
            .from('tareas')
            .select(`
                *,
                unidades:id_unidad(nombre),
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

        // Procesar datos y obtener la última entrada de calendario por tarea
        const tareasProcesadas = tareasData.map(tarea => {
            const ultimoCalendario = tarea.calendario && tarea.calendario.length > 0 
                ? tarea.calendario[tarea.calendario.length - 1] 
                : null;
                
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor.length > 0
                ? tarea.tarea_proveedor[0].proveedores.nombre
                : 'Sin asignar';

            return {
                id_tarea: tarea.id_tarea,
                nombre: tarea.nombre,
                id_unidad: tarea.unidades ? tarea.unidades.nombre : tarea.id_unidad,
                id_proveedor: proveedor,
                fecha_programada: ultimoCalendario ? ultimoCalendario.fecha_programada : null,
                estado: ultimoCalendario ? ultimoCalendario.estado : 'Pendiente'
            };
        });

        // Filtrar por fechas si se especificaron
        let tareasFiltradas = tareasProcesadas;
        
        if (inicioInput || finInput) {
            tareasFiltradas = tareasProcesadas.filter(t => {
                if (!t.fecha_programada) return false;
                
                const fecha = new Date(t.fecha_programada);
                return (!isNaN(inicio) ? fecha >= inicio : true) &&
                       (!isNaN(fin) ? fecha <= fin : true);
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
        tbody.innerHTML = `<tr><td colspan="7">No hay tareas en este rango</td></tr>`;
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
            <td>${t.id_proveedor}</td>
            <td></td>
            ${celdaEstado}
            <td>________________</td>
        </tr>`;
    });
}


// ---------- REPORTE ----------//
export async function generarReporte() {
    const inicioInput = document.getElementById('fechaInicioR').value;
    const finInput = document.getElementById('fechaFinR').value;
    const estadoFiltro = document.getElementById('estadoR').value;
    
    // Verificar si todos los filtros están vacíos
    if (!inicioInput && !finInput && estadoFiltro === '0') {
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
                unidades:id_unidad(nombre),
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

        // Procesar datos y obtener la información completa
        const tareasProcesadas = tareasData.map(tarea => {
            const ultimoCalendario = tarea.calendario && tarea.calendario.length > 0 
                ? tarea.calendario[tarea.calendario.length - 1] 
                : null;
                
            const proveedor = tarea.tarea_proveedor && tarea.tarea_proveedor.length > 0
                ? tarea.tarea_proveedor[0].proveedores.nombre
                : 'Sin asignar';

            // Obtener refacciones utilizadas
            const refacciones = tarea.tarea_refaccion && tarea.tarea_refaccion.length > 0
                ? tarea.tarea_refaccion.map(tr => 
                    `${tr.refacciones.nombre} (${tr.cantidad})`
                  ).join(', ')
                : 'Ninguna';

            return {
                fecha_programada: ultimoCalendario ? ultimoCalendario.fecha_programada : null,
                fecha_realizada: ultimoCalendario ? ultimoCalendario.fecha_realizada : null,
                nombre: tarea.nombre,
                id_unidad: tarea.unidades ? tarea.unidades.nombre : tarea.id_unidad,
                id_proveedor: proveedor,
                estado: ultimoCalendario ? ultimoCalendario.estado : 'Pendiente',
                refacciones: refacciones,
                observaciones: ultimoCalendario ? ultimoCalendario.observaciones : ''
            };
        });

        // Filtrar por fechas Y estado
        let tareasFiltradas = tareasProcesadas;
        
        if (inicioInput || finInput || estadoFiltro !== '0') {
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
                
                return cumpleFechas && cumpleEstado;
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
        tbody.innerHTML = `<tr><td colspan="7">No hay tareas que coincidan con los filtros</td></tr>`;
        return;
    }

    tareas.forEach(t => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${t.fecha_programada || 'Sin fecha'}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.id_proveedor}</td>
            <td>${t.estado}</td>
            <td>${t.refacciones}</td>
            <td>${t.observaciones || 'Sin observaciones'}</td>
        </tr>`;
    });
}
