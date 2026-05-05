// Servicios Supabase
import { getActives } from '../../services/actives-service.js'; 
import { getFullTasks } from '../../services/calendar-service.js';

let allActives = [];
let allTasks = [];

export async function createResumeCards(month) {
    // Obtener activos
    allActives = await getActives();
    if (!allActives) return;
    // Obtener tareas
    allTasks = await getFullTasks();
    if (!allTasks) return;

    // Filtrar por fecha seleccionada
    allTasks = allTasks.filter(t => new Date(t.fecha_programada).getMonth() === month);

    renderActivesCard(allActives)
    renderPendingCard(allTasks)
    renderCompletedCard(allTasks)
}

// Función para crear la card de activos totales
export async function renderActivesCard(allActives) {
    const element = document.getElementById("active-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allActives.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }
    
    // Generar el contenido
    element.textContent = `${allActives.length.toLocaleString('en-US')}`;
}

// Función para crear la card de tareas pendientes
export async function renderPendingCard(allTasks) {
    const element = document.getElementById("pending-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTasks.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allTasks.filter(t => t.estado === "Pendiente")

    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = "general-report-cant text-warning";
}

// Función para crear la card de tareas completadas
export async function renderCompletedCard(allTasks) {
    const element = document.getElementById("completed-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTasks.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allTasks.filter(t => t.estado === "Realizada")

    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = "general-report-cant text-success";
}
