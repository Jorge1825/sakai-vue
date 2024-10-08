<script setup>

import { ref } from 'vue';

function logout() {
    alert('Cerrar Sesión');
}


</script>

<template>
    <div
        class="config-panel hidden absolute top-[3.25rem] right-0 w-64 p-4 bg-surface-0 dark:bg-surface-900 border border-surface rounded-border origin-top shadow-[0px_3px_5px_rgba(0,0,0,0.02),0px_0px_2px_rgba(0,0,0,0.05),0px_1px_4px_rgba(0,0,0,0.08)]"
    >
        <div class="flex flex-col gap-4">
            <div>
                <span class="text-sm text-muted-color font-semibold">Perfil</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <q-btn @click="logout()" class="full-width" unelevated rounded color="secondary" label="ver perfil" />
                </div>
            </div>
            <div>
                <span class="text-sm text-muted-color font-semibold">Acciones</span>
                <div class="pt-2 flex gap-2 flex-wrap justify-between">
                    <q-btn @click="logout()" class="full-width" unelevated rounded color="negative" label="Cerrar Sesión" />
                </div>
            </div>
        </div>
    </div>
</template>
