
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import supabase from '../supabase/supabase-client.js'

// Función para validar sesión con Supabase
async function verificarAutenticacion() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        console.log('Sesión actual:', session);
        
        const isLoginPage = window.location.pathname.includes('login.html') || 
                           window.location.pathname === '/' || 
                           window.location.pathname.endsWith('/');
        
        if (error) {
            console.error('Error verificando autenticación:', error);
            if (!isLoginPage) {
                window.location.replace("login.html");
            }
            return false;
        }
        
        // Lógica de redirección basada en sesión y página actual
        if (session && isLoginPage) {
            window.location.replace("mantenimiento.html");
            return true;
        }
        
        if (!session && !isLoginPage) {
            window.location.replace("login.html");
            return false;
        }
        
        return session ? true : false;
        
    } catch (error) {
        console.error('Error verificando autenticación:', error);
        const isLoginPage = window.location.pathname.includes('login.html');
        if (!isLoginPage) {
            window.location.replace("login.html");
        }
        return false;
    }
}

// Verificar al cargar cada página
document.addEventListener('DOMContentLoaded', async function() {
    // Esperar a que Supabase esté completamente inicializado
    if (typeof supabase !== 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 50));
        await verificarAutenticacion();
    }
});
