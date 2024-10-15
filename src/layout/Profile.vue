<script setup>
import { ref } from 'vue';
import Cookies from "js-cookie";
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
    Cookies.remove("access_token");

    // Redirige al login
    router.push({ name: "login" });
}
</script>
<template>
    <div class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px rgba(0,0,0,0.05),0px_1px_4px rgba(0,0,0,0.08)]">
        <!-- Contenedor flex para alinear la imagen y el texto -->
        <div class="flex items-center justify-center mb-4">
            <img src="/src/assets/sosteniweb/logo_negro.png" alt="Logo" class="logo-image">
            <h2 class="ml-2"><b>SOSTENIWEB</b></h2>
        </div>
        <div class="flex flex-col gap-4">
            <div>
                <span class="text-sm text-muted-color font-semibold">Perfil</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <q-btn @click="logout()" class="full-width" unelevated rounded color="secondary"
                        label="ver perfil" />
                </div>
            </div>
            <div>
                <span class="text-sm text-muted-color font-semibold">Acciones</span>
                <!-- agregar el botón de cerrar sesión -->
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <q-btn @click="logout" class="full-width" unelevated rounded color="negative"
                        label="Cerrar Sesión" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logo-image {
    width: 15%;
    height: auto;
}

h2 {
    font-size: 1.5rem; /* Ajusta el tamaño según sea necesario */
    line-height: 1; /* Asegura que no haya margen adicional */
}
</style>