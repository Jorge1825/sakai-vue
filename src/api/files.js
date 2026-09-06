
import axiosInstance from "@/config/axios.conf";

// enterprise = id de empresa o 'all' (solo superadmin)
export const getFilesApi = async (enterprise) => {
    try {

        const response = await axiosInstance.get(`/folder/get-data/${enterprise}`);

        return response;
    } catch (error) {
        console.error('Error al obtener los folder', error);
        throw error;
    }

};

export const getFileApi = async (name) => {
    try {
        const response = await axiosInstance.get(`/folder/${name}`, {
            responseType: 'blob'
        });
        return response;
    } catch (error) {
        console.error('Error al obtener el archivo', error);
        throw error;
    }
};

// formData: campo 'files' (múltiple) + 'folderId'
export const saveFileApi = async (formData) => {
    try {
        const response = await axiosInstance.post('/folder/save-file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error al subir los archivos', error);
        throw error;
    }
};

// data: { name, idParent?, availability?, enterprise? }
export const createFolderApi = async (data) => {
    try {
        const response = await axiosInstance.post('/folder/create-folder', data);
        return response;
    } catch (error) {
        console.error('Error al crear la carpeta', error);
        throw error;
    }
};
