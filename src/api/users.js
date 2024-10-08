
import axiosInstance from "@/config/axios.conf";

export const getUsers = async () => {
    try {

        const response = await axiosInstance.get('/users');

        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión', error); 
        throw error; 
    }
};
