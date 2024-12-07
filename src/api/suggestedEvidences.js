import axiosInstance from "@/config/axios.conf";

export const getSuggestedEvidenceApi = async () => {
    try {
        const response = await axiosInstance.get('/suggestedEvidences');
        return response;
    } catch (error) {
        console.error('Error al obtener las sugerencias de evidencias', error); 
        throw error; 
    }
};

export const editSuggestedEvidenceApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/suggestedEvidences/update', data);
        return response;
    } catch (error) {
        console.error('Error al editar sugerencia de evidencia', error); 
        throw error; 
    }
};

export const createSuggestedEvidenceApi = async (data) => {
    try {
        const response = await axiosInstance.post('/suggestedEvidences/create', data);
        return response;
    } catch (error) {
        console.error('Error al crear sugerencia de evidencia', error); 
        throw error; 
    }
};

export const toggleActiveSuggestedEvidenceApi = async (id) => {
    try {
        const response = await axiosInstance.put(`/suggestedEvidences/toggle-active/${id}`);
        return response;
    } catch (error) {
        console.error('Error al activar/desactivar sugerencia de evidencia', error); 
        throw error;
    }
};

export const getNormDetailsApi = async (norm) => {
    try {
        const response = await axiosInstance.get(`/norms/${norm}`);
        return response;
    } catch (error) {
        console.error('Error al obtener los detalles de la norma', error);
        throw error;
    }
};