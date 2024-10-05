import axios from 'axios';
import Cookies from 'js-cookie';

// Crear el div y añadirlo al body
const spinnerOverlay = document.createElement('div');
spinnerOverlay.id = 'spinner-overlay';
spinnerOverlay.style.display = 'none';  // Oculto inicialmente
spinnerOverlay.style.position = 'fixed';
spinnerOverlay.style.top = '0';
spinnerOverlay.style.left = '0';
spinnerOverlay.style.width = '100%';
spinnerOverlay.style.height = '100%';
spinnerOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
spinnerOverlay.style.zIndex = '1000';
spinnerOverlay.style.display = 'none';  // Oculto inicialmente
spinnerOverlay.style.justifyContent = 'center';
spinnerOverlay.style.alignItems = 'center';

// Spinner (nueva estructura con divs)
const spinner = document.createElement('div');
spinner.className = 'loader';

const innerOne = document.createElement('div');
innerOne.className = 'inner one';

const innerTwo = document.createElement('div');
innerTwo.className = 'inner two';

const innerThree = document.createElement('div');
innerThree.className = 'inner three';

spinner.appendChild(innerOne);
spinner.appendChild(innerTwo);
spinner.appendChild(innerThree);
spinnerOverlay.appendChild(spinner);
document.body.appendChild(spinnerOverlay);

// Añadir estilos CSS para el spinner
const style = document.createElement('style');
style.innerHTML = `
  .loader {
    position: absolute;
    top: calc(50% - 32px);
    left: calc(50% - 32px);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    perspective: 800px;
  }
  
  .inner {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;  
  }
  
  .inner.one {
    left: 0%;
    top: 0%;
    animation: rotate-one 1s linear infinite;
    border-bottom: 3px solid #0EA5E9;
  }
  
  .inner.two {
    right: 0%;
    top: 0%;
    animation: rotate-two 1s linear infinite;
    border-right: 3px solid #0EA5E9;
  }
  
  .inner.three {
    right: 0%;
    bottom: 0%;
    animation: rotate-three 1s linear infinite;
    border-top: 3px solid #0EA5E9;
  }
  
  @keyframes rotate-one {
    0% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg); }
  }
  
  @keyframes rotate-two {
    0% { transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg); }
    100% { transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg); }
  }
  
  @keyframes rotate-three {
    0% { transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg); }
    100% { transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg); }
  }
`;
document.head.appendChild(style);

// Funciones para mostrar y ocultar el spinner
function showDefault() {
  spinnerOverlay.style.display = 'flex';  // Mostrar el spinner durante la solicitud
}

function hideDefault() {
  spinnerOverlay.style.display = 'none';  // Ocultar el spinner cuando se complete
}

// Crear la instancia de Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:4500/api/v1",
});

axiosInstance.defaults.withCredentials = true;

// Interceptar solicitudes
axiosInstance.interceptors.request.use(config => {
  showDefault();  // Mostrar el spinner cuando se inicie la solicitud
  return config;
}, error => {
  hideDefault();  // Ocultar el spinner en caso de error
  return Promise.reject(error);
});

// Interceptar respuestas
axiosInstance.interceptors.response.use(response => {
  hideDefault();  // Ocultar el spinner cuando se obtenga la respuesta
  if (response.status === 401) {
    handle401Error();
  }
  return response;
}, error => {
  hideDefault();  // Ocultar el spinner en caso de error
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