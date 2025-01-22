
import axiosInstance from "@/config/axios.conf";

export const getNormsApi = async () => {
    try {

        const response = await axiosInstance.get('/norms');

        return response;
    } catch (error) {
        console.error('Error al obtener las normas', error); 
        throw error; 
    }
    
};
export const getNormEnterpriseApi = async (id) => {
    try {

        const response = await axiosInstance.get(`/norms/enterprise/${id}`);

        return response;
    } catch (error) {
        console.error('Error al obtener las normas', error); 
        throw error; 
    }
    
};
export const editNormApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/norms/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar la norma', error); 
        throw error; 
    }
    
};
export const createNormApi = async (data) => {
    try {

        const response = await axiosInstance.post('/norms/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear la norma', error); 
        throw error; 
    }
    
};

export const toggleActiveNormApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.put(`/norms/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar la norma', error); 
        throw error;
    }
}
export const toggleEnterpriseNormApi = async (data) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.patch(`/norms/toggleEnterprise`, data);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar la norma', error); 
        throw error;
    }
};
export const firstDiagnostic = async (data) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.post(`/norms/first-diagnostic`, data);

        return response;
    } catch (error) {
        console.error('Error al crear el primer diagnostico', error);
        throw error;
    }
};
export const getEvaluationExpress = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.get(`/norms/express/${id}`);

        return response;
    } catch (error) {
        console.error('Error al obtener las evaluaciones express', error);
        throw error;
    }
}