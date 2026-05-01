// Servicios Supabase
import { validateUserRole } from "../../utils/session-validate";

// Mostrar detalles de la tarea en el modal
export async function planningModal(task) {
    const container = document.getElementById('modal-container');
    
    container.innerHTML = 
        `<div class="modal-header pb-4">
            <div class="row flex-column">
                <div class="col d-flex align-items-center">
                    <p class="ms-3 me-2 fw-bold" id="task-priority">${task.prioridad}</p>
                    <p class="ms-3 pt-1" id="task-id">OT-${task.id_orden_trabajo}</p>
                </div>
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-calendar-week" viewBox="0 0 16 16">
                            <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                        </svg>
                    </div>
                    <h5 class="modal-title pt-1 fw-bold" id="calendar-modalLabel">${task.tarea}</h5>
                </div>
            </div>
            <button type="button" class="btn-close me-2" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div id="modal-container" class="container">
                <div class="row mx-1">
                    <div class="col-md-6 col-lg-7">
                        <div id="task-description" class="pb-2">
                            <h5 class="fw-bold pb-2">Descripción</h5>
                            <p class="task-description">${task.descripcion}</p>
                        </div>
                        <div id="task-details" class="my-3 pb-2">
                            <p class="task-active"><b>Activo:</b> ${task.activo}</p>
                            <p class="task-departament"><b>Departamento:</b> ${task.departamento}</p>
                            <p class="task-system"><b>Sistema:</b> ${task.sistema}</p>
                            <p class="task-periodicity"><b>Periodicidad:</b> ${task.periodicidad}</p>
                        </div>
                        <div id="task-observations" class="my-3">
                            <h5 class="fw-bold pb-2">Observaciones</h5>
                            <p class="task-observations">${task.observaciones || "Sin observaciones"}</p>
                        </div>
                    </div>
                    <div class="col-md-6 col-lg-5">
                        <div id="task-responsible" class="text-center p-2 mb-3 mt-1">
                            <p class="title">RESPONSABLE ASIGNADO</p>
                            <p class="responsible">${task.responsable}</p>
                            <p class="responsible-departament">${task.puesto_responsable}</p>
                        </div>
                        <div id="task-date" class="text-center p-2 my-3">
                            <p class="title">FECHA PROGRAMADA</p>
                            <p class="programed-date">${task.fecha_programada}</p>
                        </div>
                        <div id="task-status" class="text-center p-2 my-3">
                            <p class="title">ESTADO</p>
                            <p class="task-status">${task.estado}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button id="btn-complete-task" class="btn btn-primary me-3 d-none" data-mant-only
                data-bs-target="#complete-modal" data-bs-toggle="modal" task-data='${JSON.stringify(task)}'>
                Gestionar Tarea
            </button>
        </div>`;

    validateUserRole()
        
    // Mostrar el modal
    const calendarModal = document.getElementById('calendar-modal');
    const modal = new bootstrap.Modal(calendarModal);
    modal.show();
}
