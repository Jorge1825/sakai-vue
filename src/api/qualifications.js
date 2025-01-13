
import axiosInstance from "@/config/axios.conf";

export const getQualificationsApi = async (enterpriseId) => {
    try {

        const response = await axiosInstance.get(`/qualifications/${enterpriseId}`);

        return response;
    } catch (error) {
        console.error('Error al obtener los qualifications', error); 
        throw error; 
    }
    
};
export const getQualificationsByEnterprise = async (enterpriseId) => {
    try {

        const response = await axiosInstance.get(`/qualifications/enterprise/${enterpriseId}`);

        return response;
    } catch (error) {
        console.error('Error al obtener los qualifications', error); 
        throw error; 
    }
    
};
export const getQualificationsByEnterpriseExcel = async (enterpriseId) => {
    try {

        const response = await axiosInstance.get(`/qualifications/excel/${enterpriseId}`);

        return response;
    } catch (error) {
        console.error('Error al obtener los qualifications', error); 
        throw error; 
    }
    
};
export const editQualificationApi = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.put('/qualifications/update',data);
        
        return response;
    } catch (error) {
        console.error('Error al editar calificación', error); 
        throw error; 
    }
    
};
export const createQualificationApi = async (data) => {
    try {

        const response = await axiosInstance.post('/qualifications/create',data);

        return response;
    } catch (error) {
        console.error('Error al crear calificación', error); 
        throw error; 
    }
    
};
export const toggleActiveQualificationApi = async (id) => {
    try {
        // Hacer la petición PUT al endpoint de activar/desactivar qualification
        const response = await axiosInstance.put(`/qualifications/toggle-active/${id}`);

        return response;
    } catch (error) {
        console.error('Error al activar/desactivar calificación', error);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
        throw error;
    }
};

export const qualificationNormApi = async (data) => {
    try {
        const response = await axiosInstance.post('/qualifications/evaluate',data);

        return response;
    } catch (error) {
        console.error('Error al crear norma', error); 
        throw error; 
    }
}
// Nueva función para procesar requisitos
export const processRequirementsApi = async (formData) => {

    try {
        const response = await axiosInstance.post('/qualifications/process-requirements', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Error al procesar los requisitos', error);
        throw error;
    }
};