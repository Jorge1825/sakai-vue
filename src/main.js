import { createApp } from 'vue';
import { Quasar, Dialog, Notify } from 'quasar'
import quasarLang from 'quasar/lang/es'
// Import icon libraries
import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/material-symbols-sharp/material-symbols-sharp.css'

// Import Quasar css
import 'quasar/src/css/index.sass'
import 'animate.css';

import App from './App.vue';
import router from './router';

import Lara from '@primevue/themes/lara';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueApexCharts from "vue3-apexcharts";

import '@/assets/styles.scss';
import '@/assets/tailwind.css';


const app = createApp(App);
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Lara,
        options: {
            darkModeSelector: '.app-dark'
        },
        
    }
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(VueApexCharts);
app.use(Quasar, {
    plugins: {
        Dialog,
        Notify,
    }, // import Quasar plugins and add here
    lang: quasarLang,
  })

app.mount('#app');