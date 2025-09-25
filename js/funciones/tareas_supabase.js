
import supabase from '../supabase/supabase-client.js'

export async function generarTareas(options) {
    const {
        prefijoInputs,
        renderTabla,
        soloPendientes = false,
        incluirRefacciones = false
    } = options;

    // Leer filtros desde el DOM
    const inicioInput = document.getElementById(`fechaInicio${prefijoInputs}`)?.value;
    const finInput = document.getElementById(`fechaFin${prefijoInputs}`)?.value;
    const estadoFiltro = document.getElementById(`estado${prefijoInputs}`)?.value || '0';
    const departamentoFiltro = document.getElementById(`departamento${prefijoInputs}`)?.value || '0';

    // Si no hay filtros activos (excepto Gestión que siempre filtra pendientes)
    if (!inicioInput && !finInput && estadoFiltro === '0' && departamentoFiltro === '0' && !soloPendientes) {
        renderTabla([]);
        return;
    }

    const inicio = inicioInput ? new Date(inicioInput) : new Date(NaN);
    const fin = finInput ? new Date(finInput) : new Date(NaN);

    try {
        // Construir select dinámico
        let selectQuery = `
            *,
            unidades:id_unidad(
                nombre,
                id_empleado(
                    nombre,
                    departamentos(nombre)
                )
            ),
            tarea_proveedor!tarea_proveedor_id_tarea_fkey(
                id_proveedor,
                proveedores(id_proveedor, nombre)
            ),
            calendario!calendario_id_tarea_fkey(
                fecha_programada,
                estado,
                observaciones
            )
        `;

        if (incluirRefacciones) {
            selectQuery += `,
            tarea_refaccion!tarea_refaccion_id_tarea_fkey(
                cantidad,
                refacciones(nombre)
            )`;
        }

        let query = supabase.from('tareas').select(selectQuery)
            .not('calendario', 'is', null)
            .not('tarea_proveedor', 'is', null);

        if (soloPendientes) {
            query = query.eq('calendario.estado', 'Pendiente');
        }

        const { data: tareasData, error } = await query;
        if (error) throw error;

        // Expandir calendario
        const tareasProcesadas = tareasData.flatMap(tarea => {
            const proveedor = tarea.tarea_proveedor?.[0]?.proveedores?.nombre || 'Sin asignar';
            const departamento = tarea.unidades?.id_empleado?.departamentos?.nombre || 'N/A';

            const refacciones = incluirRefacciones && tarea.tarea_refaccion?.length
                ? tarea.tarea_refaccion.map(tr => `${tr.refacciones.nombre} (${tr.cantidad})`).join(', ')
                : incluirRefacciones ? 'Ninguna' : undefined;

            return tarea.calendario
                .filter(cal => !soloPendientes || cal.estado === 'Pendiente')
                .map(cal => ({
                    id_tarea: tarea.id_tarea,
                    nombre: tarea.nombre,
                    id_unidad: tarea.unidades?.nombre || tarea.id_unidad,
                    departamento,
                    id_proveedor: proveedor,
                    fecha_programada: cal.fecha_programada,
                    estado: cal.estado,
                    refacciones,
                    observaciones: cal.observaciones || ''
                }));
        });

        // Ordenar por fecha
        tareasProcesadas.sort((a, b) => new Date(a.fecha_programada) - new Date(b.fecha_programada));

        // Filtrado final por fechas, estado y departamento
        const tareasFiltradas = tareasProcesadas.filter(t => {
            const cumpleFechas = (!isNaN(inicio) ? new Date(t.fecha_programada) >= inicio : true) &&
                                 (!isNaN(fin) ? new Date(t.fecha_programada) <= fin : true);
            const cumpleEstado = estadoFiltro === '0' || t.estado === estadoFiltro;
            const cumpleDepartamento = departamentoFiltro === '0' || t.departamento === departamentoFiltro;
            return cumpleFechas && cumpleEstado && cumpleDepartamento;
        });

        renderTabla(tareasFiltradas);

    } catch (error) {
        console.error('Error cargando tareas:', error);
        renderTabla([]);
    }
}