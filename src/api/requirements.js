import axiosInstance from "@/config/axios.conf";

// Obtener todos los requisitos
export const getRequirementsApi = async () => {
    try {
        const response = await axiosInstance.get('/requirements');
        return response;
    } catch (error) {
        console.error('Error al obtener los requisitos', error);
        throw error;
    }
};

// Crear un nuevo requisito
export const createRequirementApi = async (data) => {
    try {
        const response = await axiosInstance.post('/requirements/create', data);
        return response;
    } catch (error) {
        console.error('Error al crear el requisito', error);
        throw error;
    }
};

// Editar un requisito
export const editRequirementApi = async (data) => {
    try {
        const response = await axiosInstance.put(`/requirements/update`, data);
        return response;
    } catch (error) {
        console.error('Error al editar el requisito', error);
        throw error;
    }
};

// Activar/Desactivar un requisito
export const toggleActiveRequirementApi = async (id) => {
    try {
        const response = await axiosInstance.put(`/requirements/toggle-active/${id}`);
        return response;
    } catch (error) {
        console.error('Error al activar/desactivar el requisito', error);
        throw error;
    }
};