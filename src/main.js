// Estilos generales
import './css/style.css';
import './css/pages/index.css';

// Estilos de componentes
import './css/components/navbar.css';
import './css/components/footer.css';

// Componentes JS
import './js/components/navbar.js';

// Servicios Supabase
import { initPage } from './js/utils/session-validate.js';
import { createResumeCards } from './js/components/index/resume-cards.js';
import { renderPriorityGraphic, renderTasksGraphic } from './js/components/index/tasks-graphic.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Obtener la fecha actual
    const today = new Date();
    const month = today.getMonth();

    const dayText = document.getElementById('dayHeader');
    dayText.innerHTML = `${today.toISOString().split("T")[0] || "-"}`;

    await initPage()
    createResumeCards(month)
    renderPriorityGraphic(month)
    renderTasksGraphic()
})