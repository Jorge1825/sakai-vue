import axios from '../axios';

export const getUserData = async () => {
  try {
  const response = await axios.get('/api/users');
  return response.data;
  } catch (error){
    console.error('Error en servicio de usuario', error);
    throw error;
  }
};
