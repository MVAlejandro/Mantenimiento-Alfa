
// Expresiones regulares para validación de datos
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Nombres y el apellidos
const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,:()\/\-–—]+$/; // Texto con algunos caracteres especiales
const rfcRegex = /^([A-Z&Ñ]{3,4})\d{6}[A-Z0-9]{3}$/; // RFC
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/; // Email
const phoneRegex = /^[1-9]\d{9}$/; // Número telefónico
const cpRegex = /^\d{5}$/ // Código postal
const amountRegex = /^\d+([-\.]\d{1,2})?$/ // Cantidades y precios
const passRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()\/\-–—_!@#$%^&*+=?:;'"{}[\]<>\|~`]+$/; // Contraseñas con signos comunes

// Función que valida que los campos sean solo letras, algunos caracteres especiales y que haya al menos 3 caracteres
export function textValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (input.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        input.classList.add('is-invalid');
    } else if (!textRegex.test(input.value)) {
        error.textContent = `El campo no acepta esos caracteres especiales`;
        input.classList.add('is-invalid');
    } else {
        error.textContent = '';
        input.classList.add('is-valid');
    }
}

// Función que valida que los campos sean solo letras y que haya al menos 3 caracteres
export function nameValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (input.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        input.classList.add('is-invalid');
    } else if (!nameRegex.test(input.value)) {
        error.textContent = `El campo no acepta caracteres especiales ni números`;
        input.classList.add('is-invalid');
    } else {
        error.textContent = '';
        input.classList.add('is-valid');
    }
}

// Función que valida que el rfc tenga un formato válido
export  function rfcValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!rfcRegex.test(input.value)) {
        error.textContent=`El RFC debe de cumplir con el formato válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el correo tenga un formato válido
export  function emailValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!emailRegex.test(input.value)) {
        error.textContent=`El correo debe de cumplir con el formato example@example.com`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que sea un número telefónico
export function phoneValidate(input, error) {
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if (!phoneRegex.test(input.value.trim())) {
        error.textContent=`El número telefónico no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el código postal sea correcto
export function cpValidate (input, error){
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if(!cpRegex.test(input.value)){
        error.textContent=`El código postal no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que el costo sea válido
export function amountValidate (input, error){
    error.textContent = '';
    input.classList.remove('is-invalid', 'is-valid');

    if(!amountRegex.test(input.value)){
        error.textContent=`El dato no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida que la cantidad sea menor al máximo establecido
export function quantityValidate(input, error, maxValue) {
    error.textContent = "";
    input.classList.remove("is-invalid", "is-valid");

    if(!amountRegex.test(input.value)){
        error.textContent=`El dato no es válido`;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    } else if (input.value > maxValue) {
        error.textContent = `No puede exceder ${maxValue} unidades`;
        input.classList.add("is-invalid");
        input.classList.remove('is-valid');

        input.value = maxValue;
    } else {
        error.textContent = '';
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }
}

// Función que valida los caracteres permitidos en contraseñas
export function passValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
    } else if (!passRegex.test(data.value)) {
        error.textContent=`La contraseña no puede incluir esos caracteres especiales`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que los inputs no vayan vacíos
export function inputValidate(campos) {
    for (let campo of campos) {
        if (campo.classList.contains('is-invalid')) {
        return false;
        }
    }
    return true;
} 

// Función que valida la selección de una opción en selects
export function selectValidate(selectElement, errorement) {
    const valor = selectElement.value;

    if (valor === '0') {
        selectElement.classList.add('is-invalid');
        selectElement.classList.remove('is-valid');
        if (errorement) {
            errorement.textContent = 'Se debe seleccionar una opción';
        }
        return false;
    } else {
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
        if (errorement) {
            errorement.textContent = '';
        }
        return true;
    }
}