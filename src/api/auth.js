
import axiosInstance from "@/config/axios.conf";

export const login = async (email,password) => {
    try {

        const response = await axiosInstance.post('/users/login', {email,password});

        return response.data;
    } catch (error) {
        console.error('Error en el inicio de sesión', error); 
        throw error; 
    }
};
