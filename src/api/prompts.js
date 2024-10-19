
import axiosInstance from "@/config/axios.conf";

export const getPromptsApi = async () => {
    try {

        const response = await axiosInstance.get('/prompts');

        return response;
    } catch (error) {
        console.error('Error al obtener los prompts', error); 
        throw error; 
    }
    
};
export const editPromptApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/prompts/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar prompt', error); 
        throw error; 
    }
    
};
export const createPromptApi = async (data) => {
    try {

        const response = await axiosInstance.post('/prompts/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear prompt', error); 
        throw error; 
    }
    
};
export const toggleActivePromptApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.put(`/prompts/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar prompt', error); 
        throw error;
    }
};

