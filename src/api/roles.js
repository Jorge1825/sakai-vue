
import axiosInstance from "@/config/axios.conf";

export const getRolesApi = async () => {
    try {

        const response = await axiosInstance.get('/roles');

        return response;
    } catch (error) {
        console.error('Error al obtener los roles', error); 
        throw error; 
    }
    
};
export const editRoleApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/roles/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar rol', error); 
        throw error; 
    }
    
};
export const createRoleApi = async (data) => {
    try {

        const response = await axiosInstance.post('/roles/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear rol', error); 
        throw error; 
    }
    
};
export const toggleActiveRoleApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar rol
        const response = await axiosInstance.put(`/roles/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar rol', error); 
        throw error;
    }
};

