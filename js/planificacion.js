
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import {generarGantt, generarCalendario} from "./planificacion/agenda.js"
import {generarSupervision, generarReporte} from "./planificacion/reporte.js"
import {generarGestion} from "./planificacion/gestion.js"

// AGENDA
document.addEventListener('DOMContentLoaded', function() {
    generarGantt();
    generarCalendario();
});

// SUPERVISIÓN
document.getElementById('btn_genS').addEventListener('click', async function(event) {
    generarSupervision()
});
document.getElementById('btn_printS').addEventListener('click', async function(event) {
    window.print()
});

// GESTIÓN
document.getElementById('btn_busq').addEventListener('click', async function(event) {
    generarGestion()
});

// REPORTE
document.getElementById('btn_genR').addEventListener('click', function() {
    generarReporte();
});
document.getElementById('btn_printR').addEventListener('click', function() {
    window.print();
});
