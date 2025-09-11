
// Crear evento al dar click en botón Siguiente
document.getElementById("btn_login").addEventListener("click", function () {
    const key = "Pallets";
    // Función que valida que la contraseña sea igual a la establecida
    function validarContraseña() {
        const pass = document.getElementById("pass");
        const error_login = document.getElementById("error-login");
        // Restablecer el mensaje de error_login y las clases antes de empezar
        error_login.textContent = '';
        pass.classList.remove('is-invalid', 'is-valid');
    
        if (pass.value !== key) {
            error_login.textContent = `Contraseña incorrecta, solo personal autorizado`;
            pass.classList.add('is-invalid');
            return; 
        } else {
            pass.classList.add('is-valid');
            window.location.href = "mantenimiento.html"
            let sesion = {activa: true};
            localStorage.setItem("sesionActiva", JSON.stringify(sesion));
        }
    }

    validarContraseña();
    
});