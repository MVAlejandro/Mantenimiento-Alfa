
// Declaramos las expresiones regulares para validar los datos
const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Expresión regular para el nombre
const textoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,-]+$/; // Expresión regular para texto
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/; // Expresión regular para el email
const TelefonoRegex = /^[1-9]\d{9}$/; // Expresión regular para el número telefónico
const añoRegex = /^\d{4}$/ // Expresión regular para el año

// Función que valida que los id sean correctos
export function validarId(data, error) {
    // Restablecer el mensaje de error y las clases antes de empezar
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if ((data.value.length < 3) || (!textoRegex.test(data.value))) {
        error.textContent = `* ID inválido`;
        data.classList.add('is-invalid');
        return; 
    }

    data.classList.add('is-valid');
}

// Función que valida que los campos sean letras, números, "," y ".", y que haya al menos 3 caracteres
export function validarText(data, error) {
    // Restablecer el mensaje de error y las clases antes de empezar
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `* Debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
        return; 
    }

    if (!textoRegex.test(data.value)) {
        error.textContent = `* No se aceptan caracteres especiales`;
        data.classList.add('is-invalid');
        return; 
    }

    data.classList.add('is-valid');
}

// Función que valida que los campos sean solo letras y que haya al menos 3 caracteres
export function validarNombre(data, error) {
    // Restablecer el mensaje de error y las clases antes de empezar
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `* Debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
        return; 
    }

    if (!nombreRegex.test(data.value)) {
        error.textContent = `* No se aceptan caracteres especiales ni números`;
        data.classList.add('is-invalid');
        return; 
    }

    data.classList.add('is-valid');
}

// Función que valida que el correo tenga un formato válido
export  function validarEmail(email, error) {
    if (!emailRegex.test(email.value)) {
        error.textContent=`* El formato debe ser example@example.com`;
        email.classList.add('is-invalid');
        email.classList.remove('is-valid');
    } else {
        error.textContent = '';
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
    }
}

// Función que valida que sea un número telefónico
export function validarTelefono(telefono, error) {
    if (!TelefonoRegex.test(telefono.value.trim())) {
        error.textContent=`* El número telefónico no es válido`;
        telefono.classList.add('is-invalid');
        telefono.classList.remove('is-valid');
    } else {
        error.textContent = '';
        telefono.classList.remove('is-invalid');
        telefono.classList.add('is-valid');
    }
}

// Función que valida que el año sea válido
export function validarAño (año, error){
    if(!añoRegex.test(año.value)){
        error.textContent=`* El año no es válido`;
        año.classList.add('is-invalid');
        año.classList.remove('is-valid');
    } else {
        error.textContent = '';
        año.classList.remove('is-invalid');
        año.classList.add('is-valid');
    }
}
