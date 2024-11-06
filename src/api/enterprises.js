
import axiosInstance from "@/config/axios.conf";

export const getEnterprisesApi = async () => {
    try {

        const response = await axiosInstance.get('/enterprises');

        return response;
    } catch (error) {
        console.error('Error al obtener las empresas', error); 
        throw error; 
    }
    
};
export const editEnterpriseApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/enterprise/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar empresa', error); 
        throw error; 
    }
    
};
export const createEnterpriseApi = async (data) => {
    try {

        const response = await axiosInstance.post('/enterprises/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear empresa', error); 
        throw error; 
    }
    
};
export const toggleActiveEnterpriseApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar rol
        const response = await axiosInstance.put(`/enterprises/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar empresa', error); 
        throw error;
    }
};

