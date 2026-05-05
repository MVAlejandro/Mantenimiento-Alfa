// Servicios Supabase
import { getFullTasks } from "../../services/calendar-service"; 

// Función para crear el gráfico por prioridad
export async function renderPriorityGraphic(month) {
    // Obtener todos los registros
    let allTasks = await getFullTasks();

    const container = document.getElementById("graphic-priority-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!allTasks.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Filtrar y agrupar tareas por prioridad
    const taskPriorities = {};

    allTasks = allTasks.filter(t => new Date(t.fecha_programada).getMonth() === month);

    allTasks.forEach(task => {
        const priority = task.prioridad;

        if (!taskPriorities[priority]) {
            taskPriorities[priority] = 0;
        }
        taskPriorities[priority]++;
    });

    const labels = Object.keys(taskPriorities);
    const data = labels.map(label => {
        return ((taskPriorities[label] / allTasks.length) * 100).toFixed(2);
    });

    // Insertar canvas
    container.innerHTML = '<canvas id="priority-graphic"></canvas>';
    const ctx = document.getElementById('priority-graphic').getContext('2d');

    // Registrar plugin
    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Prioridad por Tarea',
                data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: value => value + '%'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

// Función para crear el gráfico de tareas
export async function renderTasksGraphic() {
    const allTasks = await getFullTasks();

    const container = document.getElementById("graphic-tasks-container");
    container.innerHTML = "";

    if (!allTasks.length) {
        container.innerHTML = `<div class="alert alert-info">No hay datos para mostrar</div>`;
        return;
    }

    // Meses fijos
    const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    // Inicializar conteo en 0
    const data = Array(12).fill(0);

    // Contar tareas por mes
    allTasks.forEach(t => {
        if (!t.fecha_programada) return;

        const date = new Date(t.fecha_programada);
        if (isNaN(date)) return;

        data[date.getMonth()]++;
    });

    // Crear canvas
    container.innerHTML = '<canvas id="tasks-graphic"></canvas>';
    const ctx = document.getElementById('tasks-graphic').getContext('2d');

    Chart.register(ChartDataLabels);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: monthNames,
            datasets: [{
                label: 'Tareas por mes',
                data: data,
                borderColor: '#8FC74A',
                backgroundColor: 'rgba(143, 199, 74, 0.2)',
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: allTasks.length,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                datalabels: {
                    align: 'top',
                    anchor: 'end'
                },
                legend: {
                    display: false
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}
