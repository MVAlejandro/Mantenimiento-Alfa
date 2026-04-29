import supabase from '../supabase/supabase-client.js'

// Función para asignar una tarea a un proveedor
export async function asignTask(taskData) {
    const { data, error } = await supabase
        .from('mant_tarea_responsable')
        .insert([taskData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para asignar refacciones a una tarea
export async function sparesTask(spareData) {
    const { data, error } = await supabase
        .from('mant_tarea_refaccion')
        .insert([spareData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}