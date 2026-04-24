import supabase from "../supabase/supabase-client";
// Servicios Supabase
import { getTrips } from "../services/trips-service";

// Función para cargar datos completos en los select del formulario
export async function loadOptions(selectId, table, valueKey, textKey, defaultOption, selectedValue = '0') {
    const select = document.getElementById(selectId);
    if (selectedValue == null) selectedValue = '0';

    select.innerHTML = '';

    // Crear opción por defecto 
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = defaultOption;
    select.appendChild(defaultOptionEl);

    const { data, error } = await supabase
        .from(table)
        .select(`${valueKey}, ${textKey}`)
        .order(`${valueKey}`, { ascending: true })

    if (error) {
        console.error(`Error cargando ${table}:`, error);
        return;
    }

    // Crear y seleccionar opciones
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];

        // Si el valor coincide, marcar como seleccionado
        if (option.value == selectedValue) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

// Función para cargar datos en relación a campos registrados
export async function loadOptionsFilter(selectId, getFunction, displayFields, idField, defaultOption, selectedId = 0) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Limpiar contenido previo
    select.innerHTML = '';

    // Obtener datos externos
    const data = await getFunction();
    if (!data) return;

    // Opción por defecto
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = defaultOption;
    select.appendChild(defaultOptionEl);

    // Eliminar duplicados por texto
    const seenTexts = new Set();

    // Agregar opciones al select
    data.forEach(item => {
        let text;
        if (Array.isArray(displayFields)) {
            text = displayFields.map(f => item[f]).filter(Boolean).join(' - ');
        } else {
            text = item[displayFields];
        }

        if (!text || seenTexts.has(text)) return;
        seenTexts.add(text);

        const optionEl = document.createElement('option');
        optionEl.value = item[idField];
        optionEl.textContent = text;

        // Marcar como seleccionado si coincide con selectedId
        if (item[idField] == selectedId) {
            optionEl.selected = true;
        }

        select.appendChild(optionEl);
    });
}

// Función para cargar los días de la semana en el filtro
export function loadDaysFilter() {
    flatpickr("#day-filter", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "multiple",
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
        disable: [
            date => date.getDay() === 0
        ]
    });
}

// Función para cargar los viajes filtrados en el select
export async function loadTripsFilter(dateFilter, displayFields, selectedId = 0) {
    const select = document.getElementById('edit-trip');
    if (!select) return;

    // Limpiar contenido previo
    select.innerHTML = '';

    // Obtener datos externos
    let data = await getTrips();
    if (!data) return;

    data = data.filter(e => e.fecha_programada === dateFilter);

    // Opción por defecto
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = "Seleccione...";
    select.appendChild(defaultOptionEl);

    // Eliminar duplicados por texto
    const seenTexts = new Set();

    // Agregar opciones al select
    data.forEach(item => {
        let text;
        if (Array.isArray(displayFields)) {
            text = displayFields.map(f => item[f]).filter(Boolean).join(' - ');
        } else {
            text = item[displayFields];
        }

        if (!text || seenTexts.has(text)) return;
        seenTexts.add(text);

        const optionEl = document.createElement('option');
        optionEl.value = item['id_viaje'];
        optionEl.textContent = text;

        // Marcar como seleccionado si coincide con selectedId
        if (item['id_viaje'] == selectedId) {
            optionEl.selected = true;
        }

        select.appendChild(optionEl);
    });
}

// Cargar clientes en el select basado en una lista previamente filtrada
export async function loadClientsFilter(filtered, selectedValue = '0') {
    const select = document.getElementById('client-filter');
    if (selectedValue == null) selectedValue = '0';

    select.innerHTML = '';

    // Opción por defecto
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = "Todos";
    select.appendChild(defaultOptionEl);

    // Eliminar duplicados por texto
    const seenTexts = new Set();
    
    filtered.forEach(item => {
        const option = document.createElement('option');

        if (!item.cliente || seenTexts.has(item.cliente)) return;
        seenTexts.add(item.cliente);

        option.value = item.id_cliente;
        option.textContent = item.cliente;

        // Si el valor coincide, marcar como seleccionado
        if (option.value == selectedValue) {
            option.selected = true;
        }
        
        select.appendChild(option);
    });
}