
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('spares-form');

    container.innerHTML = 
        `<div id="spares-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-wrench-adjustable" viewBox="0 0 16 16">
                            <path d="M16 4.5a4.5 4.5 0 0 1-1.703 3.526L13 5l2.959-1.11q.04.3.041.61"/>
                            <path d="M11.5 9c.653 0 1.273-.139 1.833-.39L12 5.5 11 3l3.826-1.53A4.5 4.5 0 0 0 7.29 6.092l-6.116 5.096a2.583 2.583 0 1 0 3.638 3.638L9.908 8.71A4.5 4.5 0 0 0 11.5 9m-1.292-4.361-.596.893.809-.27a.25.25 0 0 1 .287.377l-.596.893.809-.27.158.475-1.5.5a.25.25 0 0 1-.287-.376l.596-.893-.809.27a.25.25 0 0 1-.287-.377l.596-.893-.809.27-.158-.475 1.5-.5a.25.25 0 0 1 .287.376M3 14a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                        </svg>
                    </div>
                    <h5>Registrar Nueva Refacción</h5>
                </div>
            </div>
            <form id="spare-form">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-4 col-lg-2 label-over-border ms-auto">
                        <label for="code" class="form-label m-2">Código</label>
                        <input type="text" id="code" class="form-control" placeholder="REF-PAL-MAN-00" autocomplete="off">
                        <p class="error invalid-feedback" id="error-code" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 col-lg-2 label-over-border">
                        <label for="unit" class="form-label m-2">Unidad</label>
                        <input type="text" id="unit" class="form-control" placeholder="Unidad de Medida" autocomplete="off">
                        <p class="error invalid-feedback" id="error-unit" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 col-lg-2 label-over-border">
                        <label for="cost" class="form-label m-2">Costo</label>
                        <input type="number" id="cost" class="form-control no-arrows" placeholder="Costo unitario" autocomplete="off"> 
                        <p class="error invalid-feedback" id="error-cost" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-6 label-over-border">
                        <label for="name" class="form-label m-2">Nombre</label>
                        <input type="text" id="name" class="form-control" placeholder="Nombre de la Refacción" autocomplete="off">
                        <p class="error invalid-feedback" id="error-name" style="color: red;"></p>
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

    const sparesContainer = document.getElementById('spares-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(sparesContainer, { toggle: false });

    document.getElementById('btn-add-spare').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
        document.getElementById('spare-form').reset();
        document.getElementById('spare-form').querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    });
});
