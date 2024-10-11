<script setup>
import { login } from '@/api/auth.js';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Importar el router para redirección

const email = ref('');
const password = ref('');
const isPwd = ref(true);
const checked = ref(false);
const errorMessage = ref(''); // Para almacenar el mensaje de error
const router = useRouter(); // Inicializar el router para redirigir después del login

async function signIn() {
  try {
    // Llamar a la función login y pasar las credenciales
    const {data,status} = await login(email.value,password.value );

    console.log(data);
    
    // Si el login es exitoso
    if (data.token && status === 200) {
      errorMessage.value = ''; // Limpiar el mensaje de error si es exitoso
      
      // Redirigir a la página principal (asegúrate de que la ruta 'Home' exista)
      router.push({ name: 'dashboard' });
    }

    if (status === 401) {
      errorMessage.value = 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
    }

  } catch (error) {
    // Si ocurre un error en el login, muestra el mensaje de error
    errorMessage.value = 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
  }
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, #0EA5E9 10%, rgba(4, 178, 217, 0) 30%)">

            <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="image-container">
                            <img src="/public/demo/images/LogoSosteniweb/sosteniweb manual-23.png" alt="Logo Sosteniweb" width="75" />
                        </div>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">¡Bienvenido a SOSTENIWEB!</div>
                        <span class="text-muted-color font-medium">Ingresa los datos para continuar</span>
                    </div>

                    <!-- Mostrar mensaje de error si existe -->
                    <div v-if="errorMessage" class="text-red-600 text-center mb-4">
                        {{ errorMessage }}
                    </div>

                    <q-form @submit.prevent.stop="signIn" novalidate>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo</label>
                        <q-input
                            color="primary"
                            filled
                            v-model="email"
                            placeholder="Ingrese su correo"
                            :dense="true"
                            lazy-rules
                            :rules="[(val) => (val && val.length > 0) || 'Correo electrónico requerido', (val) => /.+@.+\..+/.test(val) || 'Correo electrónico inválido']"
                        />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                        <q-input
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

                        <div class="flex items-cstify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Recordar usuario</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste la contraseña?</span>
                        </div>
                        <q-btn style="background-color: #0EA5E9; color: white;" label="Ingresar" class="w-full" type="submit" />
                    </q-form>
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