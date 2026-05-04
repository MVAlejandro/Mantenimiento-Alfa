import supabase from '../supabase/supabase-client.js'
// Utilidades
import { statusColor } from '../components/planning/planning-calendar.js';

// Función para agendar las tareas en un arreglo de fechas con un proveedor 
export async function programTasks(taskData) {
    // Asegurar que siempre sea un arreglo
    const register = Array.isArray(taskData) ? taskData : [taskData];

    const { data, error } = await supabase
        .from('mant_ordenes_trabajo')
        .upsert(register, 
            { onConflict: 'id_tarea, fecha_programada' }
        );

    if (error) {
        console.error('Error en la programación de tareas:', error);
        throw error;
    }

    return data;
}

// Función para obtener tareas completas ordenadas por id
export async function getFullTasks() {
    const { data, error } = await supabase
        .from('mant_ordenes_trabajo')
        .select(`
            id_orden_trabajo,
            fecha_programada,
            fecha_realizada,
            estado,
            observaciones,

            id_empleado,
            rh_empleados ( nombre, numero_empleado, puesto ),

            id_proveedor,
            mant_proveedores ( nombre, empresa ),

            id_tarea,
            mant_tareas (
                nombre,
                sistema,
                prioridad,
                descripcion,

                id_activo,
                mant_activos (
                tipo_activo,
                nombre,
                id_empleado,
                rh_empleados (
                    nombre,
                    numero_empleado,
                    puesto,
                    id_departamento,
                    rh_departamentos (nombre)
                )
                ),

                id_periodicidad,
                mant_periodicidad (*)
            )
        `)
        .order('fecha_programada', { ascending: true })
        .order('id_orden_trabajo', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo tareas:', error);
        throw error;
    }
    
    return data.map(orden => ({
        id: orden.id_orden_trabajo, // id_orden_trabajo
        title: orden.mant_tareas?.nombre, // tarea
        start: orden.fecha_programada, // fecha_programada
        end: orden.fecha_programada,
        color: statusColor(orden.estado),

        id_orden_trabajo: orden.id_orden_trabajo,
        id_tarea: orden.id_tarea,
        tarea: orden.mant_tareas?.nombre,
        fecha_programada: orden.fecha_programada,
        fecha_realizada: orden.fecha_realizada,
        estado: orden.estado,
        observaciones: orden.observaciones,
        responsable: orden.id_empleado ? orden.rh_empleados?.nombre : orden.mant_proveedores?.nombre,
        puesto_responsable: orden.id_empleado ? orden.rh_empleados?.puesto : orden.mant_proveedores?.empresa,
        sistema: orden.mant_tareas?.sistema,
        prioridad: orden.mant_tareas?.prioridad,
        descripcion: orden.mant_tareas?.descripcion,
        activo: orden.mant_tareas?.mant_activos?.nombre,
        encargado: orden.mant_tareas?.mant_activos?.rh_empleados?.nombre,
        puesto_encargado: orden.mant_tareas?.mant_activos?.rh_empleados?.puesto,
        departamento: orden.mant_tareas?.mant_activos?.rh_empleados?.rh_departamentos?.nombre,
        periodicidad: orden.mant_tareas?.mant_periodicidad?.nombre,
        rep_periodicidad: orden.mant_tareas?.mant_periodicidad?.repeticiones
    }));
}

// Función para editar tareas de la base
export async function updateFullTasks(id_orden, updatedData) {
    const { data, error } = await supabase
        .from('mant_ordenes_trabajo')
        .update(updatedData)
        .eq('id_orden_trabajo', id_orden);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la tarea: ' + error.message);
    }
}