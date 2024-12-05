import axiosInstance from "@/config/axios.conf";

export const getDiagnosticApi = async () => {
    try {
        const response = await axiosInstance.get('/diagnostics');
        return response;
    } catch (error) {
        console.error('Error al obtener los diagnosticos', error); 
        throw error; 
    }
};

export const editDiagnosticApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/diagnostics/update', data);
        return response;
    } catch (error) {
        console.error('Error al editar diagnostico', error); 
        throw error; 
    }
};

export const createDiagnosticApi = async (data) => {
    try {
        const response = await axiosInstance.post('/diagnostics/create', data);
        return response;
    } catch (error) {
        console.error('Error al crear diagnostico', error); 
        throw error; 
    }
};

export const toggleActiveDiagnosticApi = async (id) => {
    try {
        const response = await axiosInstance.put(`/diagnostics/toggle-active/${id}`);
        return response;
    } catch (error) {
        console.error('Error al activar/desactivar diagnostico', error); 
        throw error;
    }
};