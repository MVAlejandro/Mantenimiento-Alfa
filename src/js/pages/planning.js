// Estilos generales
import '../../css/style.css'
import '../../css/pages/planning.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { planningCalendar } from '../components/planning/planning-calendar.js';
import { renderCompleteTaskModal } from '../components/planning/complete-modal.js';
import { calendarFilter } from '../components/planning/planning-filter.js';
import { tasksReport, tasksReportFilter } from '../components/planning/planning-report.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage();
    planningCalendar();
});

// Declarar el botón de filtrado
document.getElementById("filter-btn").addEventListener('click', async function() {
    calendarFilter();
});

// Acciones del modal de gestión de tarea
const completeModal = document.getElementById('complete-modal');
// Al abrir modal
completeModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const taskData = JSON.parse(button.getAttribute('task-data'));

    renderCompleteTaskModal(taskData);
});
// Al cerrar modal
completeModal.addEventListener('hidden.bs.modal', () => {
    completeModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    completeModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Declarar el botón para la generación del reporte
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-generate' || e.target.closest('#btn-generate')) {
        tasksReport(e);
    }
});

// Declarar el botón para generación del reporte
document.addEventListener('click', async function (e) {
    if (e.target.id === 'btn-report' || e.target.closest('#btn-report')) {

        const btn = e.target.closest('#btn-report');

        try {
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = 'Exportando...';
            }

            const report = await tasksReportFilter();

            if (!report.length) {
                Swal.fire({
                    title: 'Atención',
                    text: 'No hay datos para exportat.',
                    icon: 'warning'
                });
                return;
            }

            const dataForExcel = report.map(t => ({
                "F Programada": t.fecha_programada,
                "F Realizada": t.fecha_realizada,
                "Tarea": t.tarea,
                "Activo": t.activo,
                "Departamento": t.departamento,
                "Sistema": t.sistema,
                "Responsable": t.responsable,
                "Periodicidad": t.periodicidad,
                "Prioridad": t.prioridad,
                "Estado": t.estado,
                "Observaciones": t.observaciones
            }));

            const ws = XLSX.utils.json_to_sheet(dataForExcel);
            const wb = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(wb, ws, `Reporte`);

            XLSX.writeFile(
                wb,
                `rep_mantenimiento_${new Date().toISOString().split('T')[0]}.xlsx`
            );

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Atención',
                text: 'Ocurrió un error al generar el reporte.',
                icon: 'warning'
            });
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = 
                    `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 2h-4v3h4zm0 4h-4v3h4zm0 4h-4v3h3a1 1 0 0 0 1-1zm-5 3v-3H6v3zm-5 0v-3H1v2a1 1 0 0 0 1 1zm-4-4h4V8H1zm0-4h4V4H1zm5-3v3h4V4zm4 4H6v3h4z"/>
                    </svg>
                    <p class="ps-2">Guardar</p>`;
            }
        }
    }
});

// Al cerrar modal formatear el modal
document.getElementById('report-modal').addEventListener('hidden.bs.modal', () => {
    const tbody = document.querySelector('#report-table tbody');
    tbody.innerHTML = 
        `<tr><td class="text-center" colspan="7">No hay información para mostrar</td></tr>`;
});
