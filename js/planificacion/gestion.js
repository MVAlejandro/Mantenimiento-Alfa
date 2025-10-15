
import supabase from '../supabase/supabase-client.js'

// ---------- GESTIÓN ---------- //
// Función para cargar departamentos en el select
async function cargarDepartamentos(deptoElement) {
    const { data, error } = await supabase.from('departamentos').select('id_departamento, nombre');

    const selectDepto = document.getElementById(deptoElement);
    selectDepto.innerHTML = '<option value="0">Todos</option>';

    if (error) {
        console.error("Error cargando departamentos:", error);
        return;
    }

    data.forEach(depto => {
        const option = document.createElement('option');
        option.value = depto.id_departamento;
        option.textContent = depto.nombre;
        selectDepto.appendChild(option);
    });
}

// Función para cargar proveedores en el select
async function cargarProveedores(provElement) {
    const { data, error } = await supabase.from('proveedores').select('id_proveedor, nombre');

    const selectProv = document.getElementById(provElement);
    selectProv.innerHTML = '<option value="0">Todos</option>';

    if (error) {
        console.error("Error cargando proveedores:", error);
        return;
    }

    data.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id_proveedor;
        option.textContent = prov.nombre;
        selectProv.appendChild(option);
    });
}

// Cargar los departamentos al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDepartamentos('departamentoG')
    cargarProveedores('proveedorG')
})

export function generarTablaGestion(tareas) {
    const tbody = document.querySelector("#gestion tbody");
    tbody.innerHTML = "";

    if (!tareas || tareas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">No hay tareas pendientes en este rango</td></tr>`;
        return;
    }

    tareas.forEach((t) => {
        const idTarea = t.id_tarea;
        tbody.innerHTML += `
        <tr data-id-tarea="${idTarea}">
            <th scope="row">${t.fecha_programada || 'Sin fecha'}</th>
            <td>${t.nombre}</td>
            <td>${t.id_unidad}</td>
            <td>${t.departamento}</td>
            <td>${t.nombre_proveedor}</td>
            <td><button type="button" class="btn btn-primary tarea-btn" data-bs-toggle="modal" data-bs-target="#gestion_modal">Gestionar tarea</button></td>
        </tr>`;
    });
}

// Variable global para la tarea actual
let tareaActual = null;

// Abrir modal de gestión
document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('btn-primary') && e.target.textContent === 'Gestionar tarea') {
        const fila = e.target.closest('tr');
        tareaActual = fila.dataset.idTarea;

        // Limpiar y resetear campos
        resetearModal();
        
        // Agregar primer conjunto de campos de refacción, si no está cancelado
        agregarRefaccion();

        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('gestion_modal'));
        modal.show();
    }
});

// Resetear modal a estado inicial
function resetearModal() {
    document.getElementById('fechaRealizada').value = '';
    document.getElementById('estado').value = '0';
    document.getElementById('observaciones').value = '';
    document.getElementById('refacciones-container').innerHTML = '';
    
    // Mostrar sección de refacciones por defecto
    document.querySelector('.mb-3:nth-child(3)').style.display = 'block';
    document.getElementById('btn-addRef').style.display = 'block';
}

// Mostrar refacciones según estado seleccionado
document.getElementById('estado').addEventListener('change', function() {
    const estado = this.value;
    const seccionRefacciones = document.querySelector('.mb-3:nth-child(3)');
    const btnAgregarRef = document.getElementById('btn-addRef');
    
    if (estado === 'Cancelada') {
        // Ocultar refacciones para estado Cancelada
        seccionRefacciones.style.display = 'none';
        btnAgregarRef.style.display = 'none';
    } else {
        // Mostrar refacciones para los demás estados
        seccionRefacciones.style.display = 'block';
        btnAgregarRef.style.display = 'block';
    }
});

// Función para agregar campos de refacción
function agregarRefaccion() {
    const estado = document.getElementById('estado').value;
    if (estado === 'Cancelada') return;
    
    const container = document.getElementById("refacciones-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `refaccion_${Date.now()}_${index}`;
    
    const nuevo = document.createElement("div");
    nuevo.className = "row mb-2 refaccion-item";
    nuevo.innerHTML = 
    `<div class="col-6">
        <select class="form-select select-refaccion" 
                id="${uniqueId}_select" 
                name="${uniqueId}_select"
                data-index="${index}">
            <option value="">Seleccionar refacción</option>
        </select>
    </div>
    <div class="col-4">
        <input type="number" 
               class="form-control input-cantidad" 
               id="${uniqueId}_cantidad" 
               name="${uniqueId}_cantidad"
               placeholder="Cantidad" 
               data-index="${index}">
    </div>
    <div class="col-2 d-flex align-items-center">
        <button type="button" class="btn btn-danger btn-remove" data-index="${index}">×</button>
    </div>`;

    container.appendChild(nuevo);
    cargarOpcionesRefacciones(nuevo.querySelector('.select-refaccion'));
}

// Cargar opciones de refacciones
async function cargarOpcionesRefacciones(selectElement) {
    const { data: refacciones, error } = await supabase.from("refacciones").select("*");
    if (!error) {
        refacciones.forEach(r => {
            const option = document.createElement('option');
            option.value = r.id_refaccion;
            option.textContent = r.nombre;
            selectElement.appendChild(option);
        });
    }
}

// Agregar más refacciones
document.getElementById('btn-addRef').addEventListener('click', function() {
    agregarRefaccion();
});

// Eliminar campos de refacción
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-remove')) {
        e.target.closest('.refaccion-item').remove();
    }
});

// Guardar toda la gestión
document.getElementById('btn_addRef').addEventListener('click', async function() {
    if (!tareaActual) return;

    const fechaRealizada = document.getElementById('fechaRealizada').value;
    const estado = document.getElementById('estado').value;
    const observaciones = document.getElementById('observaciones').value;

    // Validaciones
    if (estado !== '0' && !fechaRealizada) {
        alert('Debe ingresar la fecha realizada');
        return;
    }

    try {
        // Actualizar el calendario
        if (estado !== '0') {
            const { error: errorCalendario } = await supabase
                .from('calendario')
                .update({
                    fecha_realizada: fechaRealizada,
                    estado: estado,
                    observaciones: observaciones
                })
                .eq('id_tarea', tareaActual)
                .eq('estado', 'Pendiente');

            if (errorCalendario) throw errorCalendario;
        }

        // Guardar refacciones solo si no está cancelado
        if (estado !== 'Cancelada') {
            const refaccionesItems = document.querySelectorAll('.refaccion-item');
            const refaccionesData = [];

            for (const item of refaccionesItems) {
                const select = item.querySelector('.select-refaccion');
                const input = item.querySelector('.input-cantidad');
                
                if (select.value && input.value) {
                    refaccionesData.push({
                        id_tarea: parseInt(tareaActual),
                        id_refaccion: select.value,
                        cantidad: parseFloat(input.value)
                    });
                }
            }

            if (refaccionesData.length > 0) {
                const { error: errorRefacciones } = await supabase
                    .from('tarea_refaccion')
                    .insert(refaccionesData);
                if (errorRefacciones) throw errorRefacciones;
            }
        }

        alert('Gestión guardada correctamente');
        const modal = bootstrap.Modal.getInstance(document.getElementById('gestion_modal'));
        modal.hide();

        // Recargar la tabla de gestión
        generarGestion();

    } catch (error) {
        console.error('Error guardando gestión:', error);
        alert('Error al guardar la gestión');
    }
});

// Función para cerrar el modal
document.addEventListener('hidden.bs.modal', function() {
    // Eliminar manualmente el backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
    
    // Restaurar el estilo del body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Limpiar el contenido del modal
    resetearModal();
});
