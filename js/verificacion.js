
// Función para validar que exista una sesión activa
(function validarSesionYCliente() {
    // Validar sesión activa
    try {
        const sesion = JSON.parse(localStorage.getItem("sesionActiva"));
        if (!sesion || !sesion.activa) {
            window.location.href = "login.html";
            return;
        }
    } catch (error) {
        window.location.href = "login.html";
        return;
    }
})();