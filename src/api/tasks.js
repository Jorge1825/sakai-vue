import axiosInstance from '@/config/axios.conf';

/**
 * Get the status and result of a background task.
 * @param {string} id - The task ID.
 * @returns {Promise<Object>} - The task document.
 */
export const getTaskStatusApi = async (id) => {
    try {
        const response = await axiosInstance.get(`/tasks/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el estado de la tarea', error);
        throw error;
    }
};

/**
 * List recent tasks (for debugging).
 * @returns {Promise<Array>} - List of tasks.
 */
export const getTasksApi = async () => {
    try {
        const response = await axiosInstance.get('/tasks');
        return response.data;
    } catch (error) {
        console.error('Error al obtener las tareas', error);
        throw error;
    }
};
