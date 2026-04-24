import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas refacciones
export async function createSpare(spareData) {
    const { data, error } = await supabase
        .from('mant_refacciones')
        .insert([spareData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener refacciones ordenadas por id
export async function getSpares() {
    const { data, error } = await supabase
        .from('mant_refacciones')
        .select('*')
        .order('id_refaccion', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo refacciones:', error);
        throw error;
    }
    
    return data
}

// Función para editar refacciones de la base
export async function updateSpare(id_refaccion, updatedData) {
    const { data, error } = await supabase
        .from('mant_refacciones')
        .update(updatedData)
        .eq('id_refaccion', id_refaccion);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la refacción: ' + error.message);
    }
}

// Función para eliminar refacciones de la base
export async function deleteSpare(idSpare) {
    if (!idSpare) {
        alert('No se pudo obtener el ID de la refacción a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('mant_refacciones')
        .delete()
        .eq('id_refaccion', idSpare);

    if (error) {
        console.error('Error eliminando refacción:', error);
        alert('Ocurrió un error al eliminar la refacción.');
        return;
    }
};