// Utilidades
import { loadOptions } from "../../utils/load-select";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('tasks-form');

    container.innerHTML = 
        `<div id="tasks-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clipboard2-plus" viewBox="0 0 16 16">
                            <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/>
                            <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5z"/>
                            <path d="M8.5 6.5a.5.5 0 0 0-1 0V8H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V9H10a.5.5 0 0 0 0-1H8.5z"/>
                        </svg>
                    </div>
                    <h5>Registrar Nueva Tarea</h5>
                </div>
            </div>
            <form id="task-form">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-6 label-over-border">
                        <label for="name" class="form-label m-2">Nombre</label>
                        <input type="text" id="name" class="form-control" placeholder="Nombre de la tarea" autocomplete="off">
                        <p class="error invalid-feedback" id="error-name" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="active" class="form-label m-2">Activo</label>
                        <select id="active" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="error-active" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="system" class="form-label m-2">Sistema</label>
                        <input type="text" id="system" class="form-control" placeholder="Sistema de enfoque" autocomplete="off">
                        <p class="error invalid-feedback" id="error-system" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-3 label-over-border">
                        <label for="periodicity" class="form-label m-2">Periodicidad</label>
                        <select id="periodicity" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="error-periodicity" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="priority" class="form-label m-2">Prioridad</label>
                        <select id="priority" class="form-select" aria-label="Default select example" disabled>
                            <option value="0">Seleccione...</option>
                            <option value="Preventivo">Preventivo</option>
                            <option value="Importante">Importante</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Muy urgente">Muy urgente</option>
                        </select>
                        <p class="error invalid-feedback" id="error-priority" style="color: red;"></p>
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

    // Cargar los selects en el formulario
    loadOptions('active', 'mant_activos', 'id_activo', 'nombre');
    loadOptions('periodicity', 'mant_periodicidad', 'id_periodicidad', 'nombre');

    const tasksContainer = document.getElementById('tasks-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(tasksContainer, { toggle: false });

    document.getElementById('btn-add-task').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
        document.getElementById('task-form').reset();
        document.getElementById('task-form').querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    });
});
