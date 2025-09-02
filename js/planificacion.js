

const tabla_periodo = document.getElementById('tabla_periodo');

// Cargar los eventos desde localStorage y mostrarlos en el calendario
$(document).ready(function() {
    const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

    // Mapear los eventos para adaptarlos al formato que FullCalendar requiere
    const events = tareas.map(tarea => {
        return {
            title: tarea.nombre,
            start: tarea.fecha_programada + 'T09:00:00', // Fecha de inicio del evento (hora de inicio a las 09:00)
            end: tarea.fecha_programada + 'T10:00:00', // Fecha de fin del evento (hora de fin a las 10:00)
            description: tarea.descripcion,
            unidad: tarea.id_unidad,
            sistema: tarea.id_sistema,
            responsable: tarea.id_proveedor,
            periodicidad: tarea.id_periodicidad,
            refacciones: tarea.id_refaccion
        };
    });

    // Inicializar el calendario FullCalendar
    $('#tabla_periodo').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,listWeek'
        },
        // Pasar los eventos cargados desde localStorage
        events: events,
        eventClick: function(event, jsEvent, view) {
            // Mostrar los detalles del evento en el modal
            evento_modal.innerHTML =
            `<div class="card mb-3">
                <div class="card-header">
                    <div class="row">
                        <div class="col-6">
                            <strong>ID:</strong> 000
                        </div>
                        <div class="col-6 text-end">
                            <p class="info"><strong>ID Encargado:</strong> ${event.responsable}</p>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="info"><strong>Nombre:</strong> ${event.title}</p>
                    <div class="row">
                        <div class="col-6">
                            <p class="info"><strong>Periodicidad:</strong> ${event.periodicidad}</p>
                        </div>
                        <div class="col-6">
                            <p class="info"><strong>Fecha programada:</strong> ${event.start.format('YYYY-MM-DD')}</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p class="info"><strong>Unidad:</strong> ${event.unidad}</p>
                        </div>
                        <div class="col-6">
                            <p class="info"><strong>Sistema:</strong> ${event.sistema}</p>
                        </div>
                    </div>
                    <p class="info"><strong>Refacciones:</strong> ${event.refacciones}</p>
                    <p class="info"><strong>Descripción:</strong> ${event.description}</p>
                </div>
            </div>`;

            // Mostrar el modal usando Bootstrap
            $('#exampleModal').modal('show');
        }
    });
});
