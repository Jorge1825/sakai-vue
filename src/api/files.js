
import axiosInstance from "@/config/axios.conf";

export const getFilesApi = async () => {
    try {

        const response = await axiosInstance.get('/folder/get-data');

        return response;
    } catch (error) {
        console.error('Error al obtener los folder', error); 
        throw error; 
    }
    
};

export const getFile = async (id) => {
    try {
        const response = await axiosInstance.get(`/folder/${id}`);
        return response;
    } catch (error) {
        console.error('Error al obtener el rol', error); 
        throw error; 
    }
};

export const createFileApi = async (data) => {
    try {

        const response = await axiosInstance.post('/folder/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear rol', error); 
        throw error; 
    }
    
}