<script setup>
import { login } from '@/api/auth.js';
import { forgotPasswordApi, newPasswordApi } from '@/api/users';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { notifyError, notifySuccess } from '@/config/notifications';
import { storeAuth } from '@/store/auth';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router'; // Importar el router para redirección

const password = ref('');
const password2 = ref('');
const isPwd = ref(true);
const isPwd2 = ref(true);
const router = useRouter(); // Inicializar el router para redirigir después del login



async function resetPassword() {
    try {
        const token = window.location.href.split('/').pop();
        console.log(token);

        const response = await newPasswordApi(password.value, token);
        if (response.status === 200) {
            notifySuccess({
                message: 'Contraseña actualizada correctamente'
            });
        }
        //volvemos a la pagina de login
        router.push({ name: 'login' });
    } catch (error) {
        console.log(error);
        notifyError({
            message: 'Error al actualizar la contraseña'
        });
    }
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #0ea5e9 10%, rgba(4, 178, 217, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="image-container">
                            <img src="../../assets/sosteniweb/logo_negro.png" alt="Logo Sosteniweb" width="75" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">¡Bienvenid@ a SOSTENIWEB!</div>
                        <span class="text-muted-color font-medium">Recupera Contraseña </span>
                    </div>

                    <q-form @submit.prevent.stop="resetPassword" novalidate>

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <q-input
                            style="border-color: rgb(4, 178, 217)"
                            color="primary"
                            filled
                            v-model="password"
                            placeholder="Ingrese su contraseña"
                            :dense="true"
                            lazy-rules
                            :rules="[(val) => (val && val.length > 0) || 'Contraseña requerida']"
                            :type="isPwd ? 'password' : 'text'"
                            append
                            :append-icon="password ? 'pi-eye' : 'pi-eye-slash'"
                            @click:append="password = !password"
                        >
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
                            </template>
                        </q-input>

                        <label for="password2" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">
                            Repita su contraseña
                        </label> 
                        <q-input
                            style="border-color: rgb(4, 178, 217)"
                            color="primary"
                            filled
                            v-model="password2"
                            placeholder="Repita su contraseña"
                            :dense="true"
                            lazy-rules
                            :rules="[
                                (val) => (val && val.length > 0) || 'Contraseña requerida',
                                (val) => val === password || 'Las contraseñas no coinciden'
                            ]"
                            :type="isPwd2 ? 'password' : 'text'"
                            append
                            :append-icon="password2 ? 'pi-eye' : 'pi-eye-slash'"
                            @click:append="password2 = !password2"
                        >
                            <template v-slot:append>
                                <q-icon :name="isPwd2 ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd2 = !isPwd2" />
                            </template>
                        </q-input>

                        <q-btn style="background-color: rgb(4, 178, 217); color: white" label="Guardar" class="w-full" type="submit" />
                    </q-form>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.image-container {
    display: flex;
    justify-content: center;
    /* Centrar horizontalmente */
}

.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}

.q-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centrar el contenido dentro del modal */
}
/* Estilo para el texto "¿Olvidaste la contraseña?" */
.forgot-password {
    color: rgb(4, 178, 217);
    cursor: pointer;
    font-weight: 500;
    text-decoration: none;
}
.watermark-container {
    position: relative;
    z-index: 1;
}

.watermark {
    position: absolute;
    bottom: 10px;
    width: 200px;
    height: 200px;
    background-image: url('../../assets/sosteniweb/logo_negro.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: 0;
    /* Cambiar de -1 a 0 para estar en el mismo nivel que el contenido */
    pointer-events: none;
    /* Para que no interfieraq con los clics del contenido*/
}
</style>
