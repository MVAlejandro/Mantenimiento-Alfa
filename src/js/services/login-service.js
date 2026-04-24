import supabase from '../supabase/supabase-client.js'

// Función para obtener la sesión actual
export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error('Error al obtener sesión:', error);
        return null;
    }

    const { session } = data;
    if (!session) return null;

    return session;
}

let cachedProfile = null;

// Función para obtener el rol del perfil
export async function getUserProfile(session) {
    if (!session) {
        console.warn('No hay sesión activa');
        return null;
    }

    if (cachedProfile) return cachedProfile;

    const { data, error } = await supabase
        .from('profiles')
        .select(`rol, nombre, apellido`)
        .eq('id', session.user.id)
        .single();

    if (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        return null;
    }

    cachedProfile = data;
    return data;
}
