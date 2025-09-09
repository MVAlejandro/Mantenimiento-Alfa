
// ---------- SUPERVISIIÓN ----------//
export function generarSupervision() {
    const inicio = new Date(document.getElementById('fechaInicioS').value);
    const fin = new Date(document.getElementById('fechaFinS').value);
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Verificar si ambas fechas están vacías
    if (isNaN(inicio) && isNaN(fin)) {
        generarTablaSuper([]);
        return;
    }

    const filtradas = tareas.filter(t => {
        const fecha = new Date(t.fecha_programada);
        return (!isNaN(inicio) ? fecha >= inicio : true) &&
            (!isNaN(fin) ? fecha <= fin : true);
    });

    generarTablaSuper(filtradas);
}

function generarTablaSuper(tareas) {
    let tbody = document.querySelector("#supervision tbody");
    tbody.innerHTML = "";

    if (tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9">No hay tareas en este rango</td></tr>`;
        return;
    }

    tareas.forEach(t => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${t.fecha_programada}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.id_proveedor}</td>
            <td></td>
            <td class="text-center"><input type="checkbox"></td>
            <td >________________</td>
        </tr>`;
    });
}

// ---------- REPORTE ----------//
export function generarReporte() {
    const inicio = new Date(document.getElementById('fechaInicioR').value);
    const fin = new Date(document.getElementById('fechaFinR').value);
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Verificar si ambas fechas están vacías
    if (isNaN(inicio) && isNaN(fin)) {
        generarTablaReporte([]);
        return;
    }

    const filtradas = tareas.filter(t => {
        const fecha = new Date(t.fecha_programada);
        return (!isNaN(inicio) ? fecha >= inicio : true) &&
            (!isNaN(fin) ? fecha <= fin : true);
    });

    generarTablaReporte(filtradas);
}

function generarTablaReporte(tareas) {
    let tbody = document.querySelector("#reporte tbody");
    tbody.innerHTML = "";

    if (tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9">No hay tareas en este rango</td></tr>`;
        return;
    }

    tareas.forEach(t => {
        tbody.innerHTML += 
        `<tr>
            <th scope="row">${t.fecha_programada}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.id_proveedor}</td>
            <td>${t.estado}</td>
            <td>${t.refacciones}</td>
            <td >${t.observaciones}</td>
        </tr>`;
    });
}

