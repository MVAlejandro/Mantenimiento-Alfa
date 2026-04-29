
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('suppliers-form');

    container.innerHTML = 
        `<div id="suppliers-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                        </svg>
                    </div>
                    <h5>Registrar Nuevo Proveedor</h5>
                </div>
            </div>
            <form id="supplier-form">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-6 label-over-border ms-auto">
                        <label for="name" class="form-label m-2">Nombre</label>
                        <input type="text" id="name" class="form-control" placeholder="Nombre del proveedor" autocomplete="off">
                        <p class="error invalid-feedback" id="error-name" style="color: red;"></p>
                    </div>
                    <div class="col-md-6 label-over-border">
                        <label for="company" class="form-label m-2">Empresa</label>
                        <input type="text" id="company" class="form-control" placeholder="Empresa SA de CV" autocomplete="off">
                        <p class="error invalid-feedback" id="error-company" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-4 col-lg-6 label-over-border">
                        <label for="location" class="form-label m-2">Dirección</label>
                        <input type="text" id="location" class="form-control" placeholder="Cuidad, Estado" autocomplete="off">
                        <p class="error invalid-feedback" id="error-location" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 col-lg-3 label-over-border">
                        <label for="phone" class="form-label m-2">Teléfono</label>
                        <input type="number" id="phone" class="form-control no-arrows" placeholder="55 1234 5678" autocomplete="off">    
                        <p class="error invalid-feedback" id="error-phone" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 col-lg-3 label-over-border">
                        <label for="email" class="form-label m-2">Correo</label>
                        <input type="email" id="email" class="form-control" placeholder="email@mail.com" autocomplete="off">    
                        <p class="error invalid-feedback" id="error-email" style="color: red;"></p>
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

    const suppliersContainer = document.getElementById('suppliers-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(suppliersContainer, { toggle: false });

    document.getElementById('btn-add-supplier').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
        document.getElementById('supplier-form').reset();
        document.getElementById('supplier-form').querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    });
});
