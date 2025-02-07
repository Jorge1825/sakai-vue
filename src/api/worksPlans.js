
import axiosInstance from "@/config/axios.conf";

export const getWorkPlanApi = async (id) => {
    try {

        const response = await axiosInstance.get('/worksPlans/'+id);

        return response;
    } catch (error) {
        console.error('Error al obtener los planes de trabajo', error); 
        throw error; 
    }
    
};
export const editWorkPlanApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/worksPlans/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar los planes de trabajo', error); 
        throw error; 
    }
    
};
export const createWorkPlanApi = async (data) => {
    try {

        const response = await axiosInstance.post('/worksPlans/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear los palnes de trabajo', error); 
        throw error; 
    }
    
};
export const toggleActiveWorkPlanApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar los planes de trabajo
        const response = await axiosInstance.put(`/worksPlans/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar los planes de trabajo', error); 
        throw error;
    }
};