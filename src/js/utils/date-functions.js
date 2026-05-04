
// Función para generar las fechas a programar dependiendo la periodicidad
export function generateDates(startDate, periodicidad, repeticiones) {
    const dates = [];
    // Festivos fijos (MM-DD)
    const holidays = [
        "01-01", // Año Nuevo
        "05-01", // Día del Trabajo
        "09-16", // Independencia
        "12-25", // Navidad
    ];

    // Normalizar la fecha inicial
    let [year, month, day] = startDate.split('-').map(Number);
    let fecha = new Date(year, month - 1, day);
    fecha.setHours(0, 0, 0, 0);

    const anio = fecha.getFullYear();
    const yearEnd = new Date(anio, 11, 31);

    let dateCount = 0;

    // Determinación de periodos y días inhábiles
    const isSunday = (f) => f.getDay() === 0;

    const isHoliday = (f) => {
        const mmdd = `${String(f.getMonth() + 1).padStart(2, '0')}-${String(f.getDate()).padStart(2, '0')}`;
        return holidays.includes(mmdd);
    };

    const nextDate = (f, periodicidad) => {
        const t = periodicidad.toLowerCase();

        const months = {
            mensual: 1,
            bimestral: 2,
            trimestral: 3,
            semestral: 6,
            anual: 12
        };

        const days = {
            diario: 1,
            semanal: 7,
            quincenal: 15
        };

        if (months[t]) {
            f.setMonth(f.getMonth() + months[t]);
        } else {
            f.setDate(f.getDate() + (days[t] || 1));
        }

        f.setHours(0, 0, 0, 0);
    };

    // Generación de las fechas finales
    while (dateCount < repeticiones && fecha <= yearEnd) {

        if (!isSunday(fecha) && !isHoliday(fecha)) {
            dates.push(new Date(fecha));
            dateCount++;
        }

        nextDate(fecha, periodicidad);
    }

    return dates;
}