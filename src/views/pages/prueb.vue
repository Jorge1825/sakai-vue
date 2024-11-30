import axiosInstance from "@/config/axios.conf";

export const getNormApi = async () => {
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
        console.error('Error al editar normas', error); 
        throw error; 
    }
    
};
export const createNormApi = async (data) => {
    try {

        const response = await axiosInstance.post('/norms/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear norma', error); 
        throw error; 
    }
    
};
export const toggleActiveNormApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar norma
        const response = await axiosInstance.put(`/norms/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar norma', error); 
        throw error;
    }
};
