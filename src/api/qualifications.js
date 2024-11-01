
import axiosInstance from "@/config/axios.conf";

export const getQualificationsApi = async () => {
    try {

        const response = await axiosInstance.get('/qualifications');

        return response;
    } catch (error) {
        console.error('Error al obtener los qualifications', error); 
        throw error; 
    }
    
};
export const editQualificationApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/qualifications/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar qualification', error); 
        throw error; 
    }
    
};
export const createQualificationApi = async (data) => {
    try {

        const response = await axiosInstance.post('/qualifications/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear qualification', error); 
        throw error; 
    }
    
};
export const toggleActiveQualificationApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar qualification
        const response = await axiosInstance.put(`/qualifications/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar qualification', error); 
        throw error;
    }
};

