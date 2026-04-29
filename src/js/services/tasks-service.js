import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas tareas
export async function createTask(taskData) {
    const { data, error } = await supabase
        .from('mant_tareas')
        .insert([taskData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener tareas ordenadas por id
export async function getTasks() {
    const { data, error } = await supabase
        .from('mant_tareas')
        .select(`
            id_tarea,
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
            mant_periodicidad (nombre, dias)
        `)
        .order('id_tarea', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo tareas:', error);
        throw error;
    }
    
    return data.map(tarea => ({
        id_tarea: tarea.id_tarea,
        nombre: tarea.nombre,
        sistema: tarea.sistema,
        prioridad: tarea.prioridad,
        descripcion: tarea.descripcion,
        id_activo: tarea.id_activo,
        tipo_activo: tarea.mant_activos?.tipo_activo,
        activo: tarea.mant_activos?.nombre,
        id_empleado: tarea.mant_activos?.id_empleado,
        encargado: tarea.mant_activos?.rh_empleados?.nombre,
        numero_encargado: tarea.mant_activos?.rh_empleados?.numero_empleado,
        puesto_encargado: tarea.mant_activos?.rh_empleados?.puesto,
        id_departamento: tarea.mant_activos?.rh_empleados?.id_departamento,
        departamento: tarea.mant_activos?.rh_empleados?.rh_departamentos?.nombre,
        id_periodicidad: tarea.id_periodicidad,
        periodicidad: tarea.mant_periodicidad?.nombre,
        dias: tarea.mant_periodicidad?.dias,
    }));
}

// Función para editar tareas de la base
export async function updateTask(id_tarea, updatedData) {
    const { data, error } = await supabase
        .from('mant_tareas')
        .update(updatedData)
        .eq('id_tarea', id_tarea);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la tarea: ' + error.message);
    }
}

// Función para eliminar tareas de la base
export async function deleteTask(idTask) {
    if (!idTask) {
        alert('No se pudo obtener el ID de la tarea a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('mant_tareas')
        .delete()
        .eq('id_tarea', idTask);

    if (error) {
        console.error('Error eliminando tarea:', error);
        alert('Ocurrió un error al eliminar la tarea.');
        return;
    }
};

// PERIODICIDAD
// Función para obtener las periodicidades de su tabla
export async function getPeriodicity() {
    const { data, error } = await supabase
        .from('mant_periodicidad')
        .select('*');
    
    if (error) {
        console.error('Error obteniendo tareas:', error);
        throw error;
    }
    
    return data
}
