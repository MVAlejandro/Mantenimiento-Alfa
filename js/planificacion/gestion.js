
// ---------- GESTION ---------- //
export function generarGestion() {
    const inicio = new Date(document.getElementById('fechaInicioG').value);
    const fin = new Date(document.getElementById('fechaFinG').value);
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Verificar si ambas fechas están vacías
    if (isNaN(inicio) && isNaN(fin)) {
        generarTablaGestion([]);
        return;
    }

    const filtradas = tareas.filter(t => {
        const fecha = new Date(t.fecha_programada);
        return (!isNaN(inicio) ? fecha >= inicio : true) &&
            (!isNaN(fin) ? fecha <= fin : true);
    });

    generarTablaGestion(filtradas);
}

function generarTablaGestion(tareas) {
    const tbody = document.querySelector("#gestion tbody");
    tbody.innerHTML = "";

    if (!tareas || tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9">No hay tareas en este rango</td></tr>`;
        return;
    }

    tareas.forEach((t, index) => {
        const idTarea = t.id_tarea;
        tbody.innerHTML += `
        <tr data-id-tarea="${idTarea}">
            <th scope="row">${t.fecha_programada}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.id_proveedor}</td>
            <td><button id="#" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#gestion_modal">Gestionar tarea</button></td>
        </tr>`;
    });
}

// Abrir modal de refacciones por tarea
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-refaccion')) {
        const fila = e.target.closest('tr');
        tareaActual = fila.dataset.idTarea;

        // Limpiar campos del modal
        document.getElementById('refaccion').innerHTML = ``;
        document.getElementById('cantidad_ref').value = "";

        // Traer refacciones desde la base
        const { data: refacciones, error } = await supabase
            .from("refacciones")
            .select("*");

        if (error) {
            console.error("Error cargando refacciones:", error);
        } else {
            const selectRef = document.getElementById('refaccion');
            refacciones.forEach(r => {
                const option = document.createElement('option');
                option.value = r.id_refaccion;
                option.textContent = r.nombre;
                selectRef.appendChild(option);
            });
        }

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('refaccion_modal'));
        modal.show();
    }
});

function agregarRefaccion() {
    const container = document.getElementById("refacciones-container");
    const nuevo = document.createElement("div");
    nuevo.className = "row mb-2";
    nuevo.innerHTML = 
    `<div class="col-6">
        <select id="refaccion" class="form-select">
                                                
        </select>
    </div>
    <div class="col-6">
        <input id="cantidad" type="number" class="form-control" placeholder="Cantidad">
    </div>`;

    container.appendChild(nuevo);
}

document.getElementById('btn-addRef').addEventListener('click', async function(event) {
    agregarRefaccion()
});
