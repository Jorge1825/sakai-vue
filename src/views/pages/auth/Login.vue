<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
//import { login } from 'C:\Users\Jefferson S\Documents\SOSTENIWEB\src\service\AuthService.js';

//Vriables dearivas para email, password y error
const email = ref('');
const password = ref('');
const checked = ref(false);
//const error = ref(null);
//const router = useRouter();
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="image-container">
                            <img src="/public/demo/images/LogoSosteniweb/sosteniweb manual-23.png" alt="Logo Sosteniweb" width="75" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">¡Bienvenido a SOSTENIWEB!</div>
                        <span class="text-muted-color font-medium">Ingresa los datos para continuar</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo</label>
                        <InputText id="email1" type="text" placeholder="Dirección del correo" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordar usuario</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste la contraseña?</span>
                        </div>
                        <Button label="Ingresar" class="w-full" as="router-link" to="/"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.image-container {
    display: flex;
    justify-content: center; /* Centrar horizontalmente */
}

.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
