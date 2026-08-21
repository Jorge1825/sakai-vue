
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Store del año evaluado.
 * Fuente única para todas las vistas: selector de Profile, calificaciones,
 * diagnóstico y planes de trabajo. Persiste en localStorage['year'] (misma clave
 * que usaba el selector antiguo) para compatibilidad con sesiones existentes.
 */
export const storeYear = defineStore(
    'storeYear',
    () => {
        const currentYear = new Date().getFullYear();

        // Años evaluables: 2023 .. año actual, más reciente primero
        const yearOptions = ref(
            Array.from({ length: currentYear - 2023 }, (_, i) => currentYear - i)
        );

        let year = ref(parseInt(localStorage.getItem('year'), 10) || currentYear);

        const setYear = (value) => {
            year.value = parseInt(value, 10) || currentYear;
            // clave legada: el POST de evaluación y Profile leen 'year' directo
            localStorage.setItem('year', year.value);
        };

        const getYear = () => year.value;

        return { year, yearOptions, setYear, getYear };
    },
    {
        persist: true,
    }
);
