
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import { generarGantt, generarCalendario } from "./planificacion/agenda.js";
import { generarTablaGestion } from "./planificacion/gestion.js"
import { generarTablaSuper, generarTablaReporte } from "./planificacion/reporte.js";
import { generarTareas } from "./funciones/tareas_supabase.js";

// AGENDA
document.addEventListener('DOMContentLoaded', function() {
    generarGantt();
    generarCalendario();
});

// SUPERVISIÓN
document.getElementById('btn_genS').addEventListener('click', async function() {
    generarTareas({
        prefijoInputs: 'S',
        renderTabla: generarTablaSuper
    });
});
document.getElementById('btn_printS').addEventListener('click', function() {
    window.print();
});

// GESTIÓN
document.getElementById('btn_busq').addEventListener('click', async function() {
    generarTareas({
        prefijoInputs: 'G',
        renderTabla: generarTablaGestion,
        soloPendientes: true
    });
});

// REPORTE
document.getElementById('btn_genR').addEventListener('click', function() {
    generarTareas({
        prefijoInputs: 'R',
        renderTabla: generarTablaReporte,
        incluirRefacciones: true
    });
});
document.getElementById('btn_printR').addEventListener('click', function() {
    window.print();
});
