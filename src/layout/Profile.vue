<script setup>
import FormProfile from '@/components/FormProfile.vue';
import Cookies from 'js-cookie';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
let year = ref();
let years = ref([]);

onBeforeMount(() => {
    window.addEventListener('storage', (event) => {
        if (event.key === 'logout-event') {
            window.location.reload();
        }
    });

    // Obtener el año actual
    const currentYear = new Date().getFullYear();

    // Crear un array de años desde 2023 hasta el año actual
    years.value = Array.from({ length: currentYear - 2023 }, (_, i) => currentYear - i);

    //obtener el año guardado en el local storage
    let yearLocal = localStorage.getItem('year') || null;
    year.value = yearLocal ? JSON.parse(yearLocal) : currentYear;
});

let dialog = ref(false);

function logout() {
    Cookies.remove('access_token');

    // Notificar a todas las pestañas que deben redirigirse al login
    localStorage.setItem('logout-event', Date.now());

    // Redirige al login
    router.push({ name: 'login' });
}

function profile() {
    dialog.value = true;
}

function closeDialog() {
    dialog.value = false;
}

function changeYear() {
    //guardar el año en el local storage
    localStorage.setItem('year', year.value);
    localStorage.setItem('logout-event', Date.now());
    // Redirigir a la página de inicio
    router.push({ path: '/' });
    window.location.reload();
}
</script>
<template>
    <div
        class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px rgba(0,0,0,0.05),0px_1px_4px rgba(0,0,0,0.08)]"
    >
        <!-- Contenedor flex para alinear la imagen y el texto -->
        <div class="flex items-center justify-center mb-4">
            <img src="/src/assets/sosteniweb/logo_negro.png" alt="Logo" class="logo-image" />
            <h2 class="ml-2"><b>SOSTENIWEB</b></h2>
        </div>
        <div class="flex flex-col gap-4">
            <span class="text-sm text-muted-color font-semibold">Año evaluado</span>
            <div class="flex flex-wrap justify-between">
                <q-select class="full-width" rounded outlined bottom-slots dense borderless options-dense v-model="year" :options="years" @update:model-value="changeYear()" />
            </div>
            <span class="text-sm text-muted-color font-semibold">Perfil</span>
            <div class="flex flex-wrap justify-between">
                <q-btn
                    @click="profile()"
                    class="full-width"
                    :style="{
                        backgroundColor: 'rgb(4, 178, 217)',
                        color: 'white',
                        borderRadius: '20px'
                    }"
                    label="ver perfil"
                />
            </div>

            <div>
                <span class="text-sm text-muted-color font-semibold">Acciones</span>
                <!-- agregar el botón de cerrar sesión -->
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <q-btn @click="logout" class="full-width" unelevated rounded color="negative" label="Cerrar Sesión" />
                </div>
            </div>
        </div>
    </div>

    <q-dialog v-model="dialog" persistent>
        <div class="container bg-white" style="min-width: 400px">
            <div class="watermark-container justify-center flex">
                <FormProfile @close-dialog="closeDialog" />
            </div>
        </div>
    </q-dialog>
</template>

<style scoped>
.logo-image {
    width: 15%;
    height: auto;
}

h2 {
    font-size: 1.5rem;
    /* Ajusta el tamaño según sea necesario */
    line-height: 1;
    /* Asegura que no haya margen adicional */
}
</style>
