
import axiosInstance from "@/config/axios.conf";
import { notifyError, notifySuccess } from "@/config/notifications";

export const getUsersApi = async () => {
    try {

        const response = await axiosInstance.get('/users');

        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión', error); 
        throw error; 
    }
    
};
export const editUserApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/users/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar usuario', error); 
        throw error; 
    }
    
};
export const createUserApi = async (data) => {
    try {

        const response = await axiosInstance.post('/users/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear usuario', error); 
        throw error; 
    }
    
};
export const toggleActiveUserApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar usuario
        const response = await axiosInstance.put(`/users/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar usuario', error); 
        throw error;
    }
};

export const forgotPasswordApi = async (email) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar usuario
        const response = await axiosInstance.get(`/users/forgot-password/${email}`);

        return response;
    } catch (error) {
        console.error('Error al resetear contraseña', error); 
        throw error;
    }
};

export const newPasswordApi = async (password, token) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar usuario
        const response = await axiosInstance.put(`/users/new-password`, { 
            password,
            token_temp: token
        });

        return response;
    } catch (error) {
        console.error('Error al resetear contraseña', error);
        throw error;
    }
};

export const checkFirstDiagnosticApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar usuario
        const response = await axiosInstance.put(`/users/check-first-diagnostic/${id}`);

        return response;
    } catch (error) {
        notifyError({ message: 'Error al crear la norma.' });
        throw error;
    }
}

