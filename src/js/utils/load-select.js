import supabase from "../supabase/supabase-client";

// Función para cargar datos completos en los select del formulario
export async function loadOptions(selectId, table, valueKey, textKey, selectedValue = '0') {
    const select = document.getElementById(selectId)
    if (!select) return

    if (selectedValue !== '0') {
        select.innerHTML = '';
    }
    
    const { data, error } = await supabase.from(table)
        .select(`${valueKey}, ${textKey}`)
        .order(`${textKey}`, { ascending: true }) 

    if (error) {
        console.error(`Error cargando ${table}:`, error)
        return
    }

    data.forEach(item => {
        const option = document.createElement('option')
        option.value = item[valueKey]
        option.textContent = item[textKey]

        // Si el valor coincide, marcar como seleccionado
        if (selectedValue && item[valueKey] === selectedValue) {
            option.selected = true
        }

        select.appendChild(option)
    })
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

// Función para cargar los empleados de un departamento especificado
export async function loadStaff(selectId, departamentId) {
    const select = document.getElementById(selectId);
    if (!select) return
    
    const { data, error } = await supabase
        .from('rh_empleados')
        .select('id_empleado, nombre')
        .eq('id_departamento', departamentId)
        .eq('estatus', 'Activo')

    if (error) {
        console.error("Error cargando empleados:", error);
        return;
    }
    if (data.length == 0) {
        select.innerHTML = '<option value="">Sin coincidencias...</option>';
    } else {
        select.innerHTML = '<option value="0">Seleccione...</option>';
        
        data.forEach(emp => {
            const option = document.createElement('option');
            option.value = emp.id_empleado;
            option.textContent = emp.nombre;
            select.appendChild(option);
        });
    }
}
