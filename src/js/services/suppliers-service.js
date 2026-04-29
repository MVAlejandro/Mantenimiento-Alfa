import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos proveedores
export async function createSupplier(supplierData) {
    const { data, error } = await supabase
        .from('mant_proveedores')
        .insert([supplierData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener proveedores ordenados por id
export async function getSuppliers() {
    const { data, error } = await supabase
        .from('mant_proveedores')
        .select('*')
        .order('id_proveedor', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo proveedores:', error);
        throw error;
    }
    
    return data
}

// Función para editar proveedores de la base
export async function updateSupplier(id_proveedor, updatedData) {
    const { data, error } = await supabase
        .from('mant_proveedores')
        .update(updatedData)
        .eq('id_proveedor', id_proveedor);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la proveedor: ' + error.message);
    }
}

// Función para eliminar proveedores de la base
export async function deleteSupplier(idSupplier) {
    if (!idSupplier) {
        alert('No se pudo obtener el ID del proveedor a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('mant_proveedores')
        .delete()
        .eq('id_proveedor', idSupplier);

    if (error) {
        console.error('Error eliminando proveedor:', error);
        alert('Ocurrió un error al eliminar el proveedor.');
        return;
    }
};

// ----------------------------- EMPLEADOS ----------------------------- //
// Función para obtener empleados de mantenimiento ordenados por número de empleado
export async function getStaff() {
    const { data, error } = await supabase
        .from('rh_empleados')
        .select(`*, rh_departamentos (nombre)`)
        .eq('estatus', 'Activo')
        .eq('id_departamento', 12)
        .order('numero_empleado', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo empleados:', error);
        throw error;
    }
    
    return data.map(emp => ({
        ...emp,
        departamento: emp.rh_departamentos?.nombre
    }));
}