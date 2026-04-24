import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos activos
export async function createActive(activeData) {
    const { data, error } = await supabase
        .from('mant_activos')
        .insert([activeData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener activos ordenados por id
export async function getActives() {
    const { data, error } = await supabase
        .from('mant_activos')
        .select(`
            id_activo,
            codigo,
            tipo_activo,
            nombre,
            modelo,
            anio,
            descripcion,
            id_empleado,
            rh_empleados (
                nombre,
                numero_empleado,
                puesto, 
                id_departamento,
                rh_departamentos (nombre))
            `)
        .order('id_activo', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo activos:', error);
        throw error;
    }
    
    return data.map(activo => ({
        id_activo: activo.id_activo,
        codigo: activo.codigo,
        tipo_activo: activo.tipo_activo,
        nombre: activo.nombre,
        modelo: activo.modelo,
        anio: activo.anio,
        descripcion: activo.descripcion,
        id_clid_empleadoiente: activo.id_empleado,
        encargado: activo.rh_empleados?.nombre,
        numero_encargado: activo.rh_empleados?.numero_empleado,
        puesto_encargado: activo.rh_empleados?.puesto,
        id_departamento: activo.rh_empleados?.id_departamento,
        departamento: activo.rh_empleados?.rh_departamentos?.nombre
    }));
}

// Función para editar activos de la base
export async function updateActive(id_activo, updatedData) {
    const { data, error } = await supabase
        .from('mant_activos')
        .update(updatedData)
        .eq('id_activo', id_activo);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el activo: ' + error.message);
    }
}

// Función para eliminar activos de la base
export async function deleteActive(idActive) {
    if (!idActive) {
        alert('No se pudo obtener el ID del activo a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('mant_activos')
        .delete()
        .eq('id_activo', idActive);

    if (error) {
        console.error('Error eliminando activo:', error);
        alert('Ocurrió un error al eliminar el activo.');
        return;
    }
};