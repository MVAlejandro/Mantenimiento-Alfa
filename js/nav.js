
const header = document.getElementById("site_header")
const footer = document.getElementById("site_footer")

window.addEventListener("load", function(event){
    crearHeader();
    crearFooter();

    const currentLocation = window.location.href;
    const menuItems = document.querySelectorAll('.nav-link');
        
        menuItems.forEach(item => {
            if (item.href === currentLocation) {
                item.classList.add('active');
            }
        });
    });

function crearHeader(){
    header.insertAdjacentHTML("afterbegin",
        `<nav id="nav_principal" class="navbar navbar-expand-lg">
            <div class="container-fluid">
                <a id="nav_logo" class="navbar-brand" href="../mantenimiento.html">
                    <img src="./assets/Logo-Color-PNG-62x51.png" alt="Pallets Alfa logo">
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                <ul class="navbar-nav">
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../unidades.html">Unidades</a>
                    </li>
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../sistemas.html">Sistemas</a>
                    </li>
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../refacciones.html">Refacciones</a>
                    </li>
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../proveedores.html">Proveedores</a>
                    </li>
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../tareas.html">Tareas</a>
                    </li>
                    <li class="nav-item ms-2 me-2">
                        <a class="nav-link" style="color: white;" href="../planificacion.html">Planificación</a>
                    </li>
                </ul>
                </div>
            </div>
        </nav>`
    );
}

function crearFooter(){
    footer.insertAdjacentHTML("beforeend",
        `<div class="container">
            <hr>
            <div class="row align-items-center">
                <div id="iso_footer" class="col text-start">
                    <img src="./assets/iso-9001-150x46.png" alt="ISO 9001" width="120px">
                </div>
                <div id="texto_footer" class="col text-end">
                    <p>Pallets Alfa Texcoco</p>
                </div>
            </div>
            <br>
        </div>`
    );
}