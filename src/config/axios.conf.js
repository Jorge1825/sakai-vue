import axios from 'axios';
import Cookies from 'js-cookie';


// Crear el div y añadirlo al body
const spinnerOverlay = document.createElement('div');
spinnerOverlay.id = 'spinner-overlay';
spinnerOverlay.style.display = 'none';
spinnerOverlay.style.position = 'fixed';
spinnerOverlay.style.top = '0';
spinnerOverlay.style.left = '0';
spinnerOverlay.style.width = '100%';
spinnerOverlay.style.height = '100%';
spinnerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
spinnerOverlay.style.zIndex = '1000';
spinnerOverlay.style.justifyContent = 'center';
spinnerOverlay.style.alignItems = 'center';

const spinner = document.createElement('div');
spinner.className = 'spinner';
spinner.style.border = '16px solid #f3f3f3';
spinner.style.borderTop = '16px solid #3498db';
spinner.style.borderRadius = '50%';
spinner.style.width = '120px';
spinner.style.height = '120px';
spinner.style.animation = 'spin 2s linear infinite';

spinnerOverlay.appendChild(spinner);
document.body.appendChild(spinnerOverlay);

// Añadir estilos CSS para la animación del spinner
const style = document.createElement('style');
style.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

function showDefault() {
    spinnerOverlay.style.display = 'flex';
}

function hideDefault() {
    spinnerOverlay.style.display = 'none';
}

const axiosInstance = axios.create({
    baseURL: "http://localhost:4500/api/v1",
});

axiosInstance.defaults.withCredentials = true;

// Interceptar solicitudes
axiosInstance.interceptors.request.use(config => {
    showDefault();
    return config;
}, error => {
    hideDefault();
    return Promise.reject(error);
});

// Interceptar respuestas
axiosInstance.interceptors.response.use(response => {
    hideDefault();
    if (response.status === 401) {
        handle401Error();
    }
    return response;
}, error => {
    hideDefault();
    if (error.response && error.response.status === 401) {
        Cookies.remove("access_token");
        handle401Error();
    }
    return Promise.reject(error);
});

function handle401Error() {
    // Manejar el error 401 aquí, por ejemplo, redirigir al usuario a la página de inicio de sesión
    console.log('Error 401: No autorizado');
}

export default axiosInstance;