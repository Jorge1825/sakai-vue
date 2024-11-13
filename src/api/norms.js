
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
export const toggleActiveNormApi = async (data) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar prompt
        const response = await axiosInstance.patch(`/norms/toggleEnterprise`, data);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar la norma', error); 
        throw error;
    }
};

// Enviar un archivo para un requisito
export const generateRequirementFile = async (file) => {
    try {
        // Crear el objeto FormData y añadir el archivo
        const formData = new FormData();
        formData.append('file', file);  // 'file' debe coincidir con el nombre esperado en el backend

        // Enviar el FormData a la API
        const response = await axiosInstance.post('/norms/uploadFile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    } catch (error) {
        console.error('Error al subir el archivo', error);
        throw error;
    }
};
