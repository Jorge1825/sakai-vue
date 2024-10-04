// src/services/authService.js
import axios from '../axios'; // Importar la instancia de axios

// Func iniciar sesión
export const login = async (credentials) => {
  try {
    // Enviar una solicitud POST a la ruta '/login' con las credenciales del usuario
    const response = await axios.post('/login', credentials);
    
    // Si existe en la respuesta
    if (response.data.token) {
      localStorage.setItem('token', response.data.token); // Guardar token en localStorage
    }

    // Devolver los datos de la respuesta de la API
    return response.data;
  } catch (error) {
    console.error('Error en el inicio de sesión', error); // Manejar errores en el login
    throw error; // Lanzar el error para que sea manejado por el componente llamante
  }
};

// Función para registrar a un nuevo usuario
//export const register = async (userData) => {
  try {
    // Enviar una solicitud POST a la ruta '/register' con los datos del usuario
    const response = await axios.post('/register', userData);

    // Devolver los datos de la respuesta de la API
    return response.data;
  } catch (error) {
    console.error('Error en el registro', error); // Manejar errores en el registro
    throw error; // Lanzar el error para que sea manejado por el componente llamante
  }
//};

// Función para cerrar sesión
//export const logout = () => {
  // Eliminar el token del localStorage al cerrar sesión
  //localStorage.removeItem('token');
//};
