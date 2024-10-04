import axios from "axios";
import { Dialog } from "quasar";
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
    baseURL: "https://sosteniweb-back.onrender.com/api/v1",
});

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
    return response;
}, error => {
    hideDefault();
    return Promise.reject(error);
});

export default axiosInstance;