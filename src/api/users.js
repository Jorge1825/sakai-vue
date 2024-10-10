
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
export const editUser = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/users/update',data);
        
        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión', error); 
        throw error; 
    }
    
};
export const createUser = async (data) => {
    try {

        const response = await axiosInstance.post('/users/create',data);

        return response;
    } catch (error) {
        console.error('Error en el inicio de sesión', error); 
        throw error; 
    }
    
};

