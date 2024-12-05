import axiosInstance from "@/config/axios.conf";

// Obtener todas las sugerencias de evidencias
export const getSuggestedEvidenceApi = async () => {
    try {
        const response = await axiosInstance.get('/suggested-evidences');
        return response;
    } catch (error) {
        console.error('Error al obtener la sugerencia de evidencias', error); 
        throw error; 
    }
};

// Editar una sugerencia de evidencia
export const editSuggestedEvidenceApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/suggested-evidences', data);
        return response;
    } catch (error) {
        console.error('Error al editar las sugerencias de evidencias', error); 
        throw error; 
    }
};

// Crear una nueva sugerencia de evidencia
export const createSuggestedEvidenceApi = async (data) => {
    try {
        const response = await axiosInstance.post('/suggested-evidences', data);
        return response;
    } catch (error) {
        console.error('Error al crear la sugerencia de evidencia', error); 
        throw error; 
    }
};

// Activar/desactivar una sugerencia de evidencia
export const toggleActiveSuggestedEvidenceApi = async (id) => {
    try {
        const response = await axiosInstance.patch(`/suggested-evidences/${id}/toggle`);
        return response;
    } catch (error) {
        console.error('Error al activar/desactivar la sugerencia de evidencia', error); 
        throw error;
    }
};

// Obtener todas las normas
export const getNormsApi = async () => {
    try {
        const response = await axiosInstance.get('/norms');
        return response;
    } catch (error) {
        console.error('Error al obtener las normas', error); 
        throw error;
    }
};

// Obtener los requerimientos de una norma específica
export const getRequirementsApi = async (normId) => {
    try {
        const response = await axiosInstance.get(`/norms/${normId}/requirements`);
        return response;
    } catch (error) {
        console.error('Error al obtener los requerimientos', error); 
        throw error;
    }
};