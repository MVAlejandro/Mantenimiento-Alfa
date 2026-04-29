import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createSupplier } from '../../services/suppliers-service.js'; 
import { renderSuppliersList } from './suppliers-list.js';
// Utilidades
import { nameValidate, textValidate, emailValidate, phoneValidate, inputValidate } from '../../utils/form-validations.js';
import { renderStaffList } from './staff-list.js';

// Función para agregar un activo mediante ek formulario
export async function addSupplier(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('supplier-form');
    // Referencias para validación
    const nombreIn = document.getElementById("name");
    const empresaIn = document.getElementById("company");
    const direccionIn = document.getElementById("location");
    const telefonoIn = document.getElementById("phone");
    const correoIn = document.getElementById("email");
    // Referencias para errores
    const nombreError = document.getElementById('error-name');
    const empresaError = document.getElementById('error-company');
    const direccionError = document.getElementById('error-location');
    const telefonoError = document.getElementById('error-phone');
    const correoError = document.getElementById('error-email');

    // Validaciones
    nameValidate(nombreIn, nombreError)
    textValidate(empresaIn, empresaError)
    textValidate(direccionIn, direccionError)
    phoneValidate(telefonoIn, telefonoError)
    emailValidate(correoIn, correoError)

    const campos = form.querySelectorAll('input')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
        return
    }

    // Guardar valores
    const newSupplierData = {
        nombre: nombreIn.value,
        empresa: empresaIn.value,
        direccion: direccionIn.value,
        telefono: telefonoIn.value,
        correo: correoIn.value
    };

    try {
        await createSupplier(newSupplierData);
        
        Swal.fire({
            title: 'Proveedor agregado con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        await renderStaffList()
        await renderSuppliersList();
    } catch (err) {
        console.error('Error al agregar proveedor:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al generar el proveedor.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
    }
}
