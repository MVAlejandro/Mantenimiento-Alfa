
// IMPORTACIÓN DE FUNCIONES EXTERNAS
import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"
import {generarGantt, generarCalendario} from "./planificacion/agenda.js"
import {generarSupervision, generarReporte} from "./planificacion/reporte.js"
import {generarGestion} from "./planificacion/gestion.js"

// Conexión a Supabase
const supabaseUrl = "https://omsxyeiwlchkpdojzbbk.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tc3h5ZWl3bGNoa3Bkb2p6YmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMDQ3MjAsImV4cCI6MjA3MjY4MDcyMH0.EAAqXwFShq-B2L02XLL28g_NqhmFH1F4mpcqhAkWWRE"
const supabase = createClient(supabaseUrl, supabaseKey)

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
document.getElementById('btn_genR').addEventListener('click', async function(event) {
    generarReporte()
});
document.getElementById('btn_printR').addEventListener('click', async function(event) {
    window.print()
});
