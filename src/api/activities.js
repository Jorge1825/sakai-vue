
import axiosInstance from "@/config/axios.conf";

export const getActivityApi = async () => {
    try {

        const response = await axiosInstance.get('/activities');

        return response;
    } catch (error) {
        console.error('Error al obtener las actividades', error); 
        throw error; 
    }
    
};
export const editActivityApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/activities/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar actividad', error); 
        throw error; 
    }
    
};
export const createActivityApi = async (data) => {
    try {

        const response = await axiosInstance.post('/activities/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear actividad', error); 
        throw error; 
    }
    
};
export const toggleActiveActivityApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar actividad
        const response = await axiosInstance.put(`/activities/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar actividad', error); 
        throw error;
    }
};

