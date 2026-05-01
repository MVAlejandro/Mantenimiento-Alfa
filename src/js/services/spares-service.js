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
    console.log(data);
    
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

// -------------------------- REFACCIONES - ORDENES -------------------------------- //
// Función para obtener las refacciones de una orden de trabajo
export async function getOrderSpares(idOrder) {
    const { data, error } = await supabase
        .from('mant_orden_refaccion')
        .select(`
            id_orden_refaccion,
            id_orden_trabajo,
            cantidad,
            id_refaccion,
            mant_refacciones (*)
            `)
        .eq('id_orden_trabajo', idOrder);
    
    if (error) {
        console.error('Error obteniendo refacciones de la orden:', error);
        throw error;
    }
    
    return data.map(refaccionO => ({
        id_orden_refaccion: refaccionO.id_orden_refaccion,
        id_orden_trabajo: refaccionO.id_orden_trabajo,
        cantidad: refaccionO.cantidad,
        id_refaccion: refaccionO.id_refaccion,
        codigo: refaccionO.mant_refacciones?.codigo,
        refaccion: refaccionO.mant_refacciones?.nombre,
        costo_unitario: refaccionO.mant_refacciones?.costo_unitario,
        unidad_medida: refaccionO.mant_refacciones?.unidad_medida
    }));
}

// Función para editar las refacciones asignadas a la orden
export async function updateOrderSpares(idOrder) {
    const sparesItems = document.querySelectorAll('.spare-item');

    for (const item of sparesItems) {
        const select = item.querySelector('.spare-select');
        const quantity = item.querySelector('.spare-select-quantity');

        const id_refaccion = select?.value?.trim();
        const cantidad = parseFloat(quantity?.value);

        if (!id_refaccion || isNaN(cantidad) || cantidad <= 0) {
            console.warn("Fila ignorada por datos inválidos");
            continue;
        }

        // Intentar insertar y si ya existe actualizar
        const { data, error } = await supabase
            .from('mant_orden_refaccion')
            .upsert(
                {
                    id_orden_trabajo: idOrder,
                    id_refaccion,
                    cantidad
                },
                { onConflict: ['id_orden_trabajo', 'id_refaccion'] }
            );

        if (error) {
            console.error('Error actualizando orden:', error);
            throw error;
        }
    }
}