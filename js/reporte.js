
function generarReporte() {
  const inicio = new Date(document.getElementById('fechaInicio').value);
  const fin = new Date(document.getElementById('fechaFin').value);
  const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

  // Verificar si ambas fechas están vacías
  if (isNaN(inicio) && isNaN(fin)) {
    generarTabla([]);
    return;
  }

  const filtradas = tareas.filter(t => {
    const fecha = new Date(t.fecha_programada);
    return (!isNaN(inicio) ? fecha >= inicio : true) &&
           (!isNaN(fin) ? fecha <= fin : true);
  });

  generarTabla(filtradas);
}

function generarTabla(tareas) {
  const tbody = document.querySelector("#reporte tbody");
  tbody.innerHTML = "";

  if (tareas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">No hay tareas en este rango</td></tr>`;
    return;
  }

  tareas.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <th scope="row">${t.fecha_programada}</th>
        <td>${t.id_unidad}</td>
        <td>${t.id_sistema}</td>
        <td>${t.nombre}</td>
        <td>${t.id_proveedor}</td>
        <td>${t.id_refaccion}</td>
        <td >${t.id_periodicidad}</td>
        <td class="text-center"><input type="checkbox"></td>
        <td >________________</td>
      </tr>
    `;
  });
}

document.getElementById('btn_gen').addEventListener('click', async function(event) {
    generarReporte()
});
document.getElementById('btn_print').addEventListener('click', async function(event) {
    window.print()
});