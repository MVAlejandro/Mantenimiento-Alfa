// Utilidades
import { loadOptions, loadStaff } from "../../utils/load-select";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('actives-form');

    container.innerHTML = 
        `<div id="actives-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-database-add" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0"/>
                            <path d="M12.096 6.223A5 5 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.5 4.5 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.5 4.5 0 0 1-.813-.927Q8.378 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.6 4.6 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10q.393 0 .774-.024a4.5 4.5 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777M3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4"/>
                        </svg>
                    </div>
                    <h5>Registrar Nuevo Activo</h5>
                </div>
            </div>
            <form id="active-form">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-2 label-over-border">
                        <label for="code" class="form-label m-2">Código</label>
                        <input type="text" id="code" class="form-control" placeholder="INV-PAL-MAN-00" autocomplete="off">
                        <p class="error invalid-feedback" id="error-code" style="color: red;"></p>
                    </div>
                    <div class="col-md-2 label-over-border">
                        <label for="type" class="form-label m-2">Tipo</label>
                        <select id="type" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                            <option value="Equipo">Equipo</option>
                            <option value="Unidad">Unidad</option>
                            <option value="Herramienta">Herramienta</option>
                        </select>
                        <p class="error invalid-feedback" id="error-type" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 label-over-border">
                        <label for="name" class="form-label m-2">Nombre</label>
                        <input type="text" id="name" class="form-control" placeholder="Nombre del activo" autocomplete="off">
                        <p class="error invalid-feedback" id="error-name" style="color: red;"></p>
                    </div>
                    <div class="col-md-2 label-over-border">
                        <label for="model" class="form-label m-2">Modelo</label>
                        <input type="text" id="model" class="form-control" placeholder="Marca y/o Modelo" autocomplete="off">
                        <p class="error invalid-feedback" id="error-model" style="color: red;"></p>
                    </div>
                    <div class="col-md-2 label-over-border">
                        <label for="year" class="form-label m-2">Año</label>
                        <input type="number" id="year" class="form-control no-arrows" placeholder="20XX" autocomplete="off">
                        <p class="error invalid-feedback" id="error-year" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-3 label-over-border">
                        <label for="departament" class="form-label m-2">Departamento</label>
                        <select id="departament" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="error-departament" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="staff" class="form-label m-2">Responsable</label>
                        <select id="staff" class="form-select" aria-label="Default select example" disabled>
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="error-staff" style="color: red;"></p>
                    </div>
                    <div class="col-md-6 label-over-border">
                        <label for="description" class="form-label m-2">Descripción</label>
                        <input type="text" id="description" class="form-control" placeholder="Descripción del activo" autocomplete="off">    
                        <p class="error invalid-feedback" id="error-description" style="color: red;"></p>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                    <button id="btn-cancel" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                    <button id="btn-add" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                            <path d="M11 2H9v3h2z"/>
                            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                        </svg>
                        <p class="ps-2">Agregar</p>
                    </button>
                </div>
            </form>
        </div>`;

    // Cargar los departamentos en el formulario
    loadOptions('departament', 'rh_departamentos', 'id_departamento', 'nombre');
    // Detectar cambio en el select de departamento en formulario para cargar empleados
    document.getElementById('departament').addEventListener('change', function() {
        const departamentId = this.value;
        if (departamentId !== "0") {
            loadStaff('staff', departamentId);
            document.getElementById('staff').disabled = false;
        } else {
            document.getElementById('staff').innerHTML = '<option value="0">Seleccione...</option>';
            document.getElementById('staff').disabled = true;
        }
    });

    const activesContainer = document.getElementById('actives-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(activesContainer, { toggle: false });

    document.getElementById('btn-add-active').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
        document.getElementById('active-form').reset();
        document.getElementById('active-form').querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    });
});
