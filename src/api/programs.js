
import axiosInstance from "@/config/axios.conf";

export const getProgramApi = async () => {
    try {

        const response = await axiosInstance.get('/programs');

        return response;
    } catch (error) {
        console.error('Error al obtener las programas', error); 
        throw error; 
    }
    
};
export const editProgramApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/programs/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar programa', error); 
        throw error; 
    }
    
};
export const createProgramApi = async (data) => {
    try {

        const response = await axiosInstance.post('/programs/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear program', error); 
        throw error; 
    }
    
};
export const generateManual = async (data) => {
    try {

        const response = await axiosInstance.post('/programs/generateManual',data);

        return response.data
    } catch (error) {
        console.error('Error al crear program', error); 
        throw error; 
    }
    
};
export const toggleActiveProgramApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar programa
        const response = await axiosInstance.put(`/programs/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar programa', error); 
        throw error;
    }
};


export const deleteProgramApi = async (id) => {
    try {
        // Hacer la petición DELETE al endpoint de eliminar programa
        const response = await axiosInstance.delete(`/programs/${id}`);

        return response;
    } catch (error) {
        console.error('Error al eliminar programa', error); 
        throw error;
    }
}

export const addActivityApi = async (data) => {
    try {
        // Hacer la petición PUT al endpoint de agregar actividad
        const response = await axiosInstance.post(`/programs/addActivity`, data);

        return response;
    } catch (error) {
        console.error('Error al agregar actividad', error); 
        throw error;
    }
}

export const removeActivityApi = async (data) => {
    try {
        // Hacer la petición DELETE al endpoint de eliminar programa
        const response = await axiosInstance.put(`/programs/removeActivity`, data);

        return response;
    } catch (error) {
        console.error('Error al eliminar programa', error); 
        throw error;
    }
}
