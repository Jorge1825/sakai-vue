// src/axios.js
import axios from 'axios';//Importada la libreria axios

const instance = axios.create({ //crear una constate llamada instance que es instancia en Axios 
  baseURL: 'https://tu-api.com/api', // La URL base del back
  headers: {
    'Content-Type': 'application/json',//Establece el tipo de contenido a json
  },
});

export default instance;// exportar por defecto la instancia de axios
