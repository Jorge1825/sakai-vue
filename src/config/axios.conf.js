import axios from "axios";
import { Dialog } from "quasar";
import Cookies from "js-cookie";
let dialogC = null;

function showDefault() {
    dialogC = Dialog.create({
        title: "Processing",
        message: "Please wait...",
        progress: true,
        persistent: true,
        ok: false,
    });
}

function hideDefault() {
    if (dialogC) {
        dialogC.hide();
    }
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