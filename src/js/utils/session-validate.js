// Servicios supabase
import { getSession, getUserProfile } from "../services/login-service";

// Función para validar sesión con Supabase con expiración por tiempo
async function validateAuth() {
    try {
        const session = await getSession();
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const isLoginPage = currentPath === 'login.html';

        // Sin sesión → redirigir a login si no estamos en login
        if (!session && !isLoginPage) {
            console.log("No hay sesión, redirigiendo a login...");
            window.location.href = "./login.html"; // ruta absoluta con extensión
            return false;
        }

        // Sesión expirada
        const SESSION_DURATION_HOURS = 16;
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        if (loginTimestamp) {
            const elapsed = Date.now() - parseInt(loginTimestamp, 10);
            const hoursElapsed = elapsed / (1000 * 60 * 60);
            if (hoursElapsed > SESSION_DURATION_HOURS) {
                console.log("Sesión expirada automáticamente.");
                await supabase.auth.signOut();
                localStorage.removeItem('loginTimestamp');

                if (!isLoginPage) {
                    window.location.href = "./login.html";
                }
                return false;
            }
        }

        // Con sesión → redirigir a index si estamos en login
        if (session && isLoginPage) {
            console.log("Sesión activa, redirigiendo a index...");
            window.location.href = "./index.html";
            return true;
        }

        return true;

    } catch (error) {
        console.error('Error verificando autenticación:', error);
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPath !== 'login.html') {
            window.location.href = "./login.html";
        }
        return false;
    }
}

// Función para validar el rol del usuario
export async function validateUserRole() {
    try {
        // Si no hay sesión, no hacer nada
        const session = await getSession();
        if (!session) return;

        // Obtener el rol "admin", "colab", etc.
        const profile = await getUserProfile(session);
        if (!profile) return;

        const { rol, nombre, apellido } = profile;
        // console.log(`Usuario: ${nombre} ${apellido} | Rol: ${rol}`);

        if (rol === 'admin') {
            // Mostrar todos los elementos ocultos
            document.querySelectorAll('.d-none').forEach(el => {
                el.classList.remove('d-none');
            });
            // Habilitar todos los controles desactivados
            document.querySelectorAll('input:disabled, select:disabled, button:disabled').forEach(el => {
                el.disabled = false;
            });
        } else {
            // Mostrar solo los elementos correspondientes
            document.querySelectorAll(`[data-${rol}-only]`).forEach(el => {
                el.classList.remove('d-none');
            });
            // Habilitar solo controles permitidos por rol
            document.querySelectorAll(`input[data-${rol}-only]:disabled, select[data-${rol}-only]:disabled, button[data-${rol}-only]:disabled`).forEach(el => {
                el.disabled = false;
            });
        }

    } catch (error) {
        console.error('Error validando rol del usuario:', error);
    }
}

// Verificar al cargar cada página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Espera a que Supabase esté listo
        if (typeof supabase !== 'undefined') {
            // Validar autenticación
            const accessOk = await validateAuth();

            // Validar rol solo si hay acceso
            if (accessOk) {
                await validateUserRole();
            }
        }
    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});

// Función para validar todo
export async function initPage() {
    const accessOk = await validateAuth();
    if (accessOk) await validateUserRole();
}