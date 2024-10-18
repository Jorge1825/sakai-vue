<template>
    <div>
        <q-card class="q-ma-md" style="border: 1px solid rgb(4, 178, 217)">
            <q-card-section>
                <h2 class="text-h5" style="color: rgb(4, 178, 217)">LISTA DE REQUERIMIENTOS</h2>
            </q-card-section>
            <q-separator />
            <q-card-section>
                <div class="q-pa-md" style="display: flex; justify-content: flex-end;">
                    <q-btn label="AGREGAR REQUERIMIENTO" style="background-color: rgb(4, 178, 217); color: white;"
                        @click="openDialog" class="q-mb-md" />
                </div>
                <q-table :rows="requirements" :columns="columns" row-key="_id" class="q-pa-md"
                    no-data-label="NO HAY REQUERIMIENTOS DISPONIBLES" />
                <q-dialog v-model="dialog" persistent>
                    <q-card>
                        <q-card-section style="border-bottom: 1px solid rgb(4, 178, 217);">
                            <div class="text-h6" style="color: rgb(4, 178, 217); margin-bottom: 16px;">AGREGAR
                                REQUERIMIENTO</div>
                        </q-card-section>
                        <q-card-section class="q-pa-lg">
                            <q-input v-model="newRequirement.name" label="NOMBRE" />
                            <q-input v-model="newRequirement.description" label="DESCRIPCIÓN" type="textarea" />
                            <q-toggle v-model="newRequirement.status" label="ESTADO (ACTIVO/INACTIVO)" />
                        </q-card-section>
                        <q-card-actions>
                            <q-btn label="CANCELAR" @click="closeDialog" />
                            <q-btn label="GUARDAR" style="background-color: rgb(4, 178, 217); color: white;" @click="saveRequirement" />
                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-card-section>
        </q-card>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { getRequirementsApi, createRequirementApi } from '@/api/requirements'; // Importa las funciones API

const requirements = ref([]);
const dialog = ref(false);
const newRequirement = ref({
    name: '',
    description: '',
    status: true,
});

const columns = ref([
    { name: 'name', label: 'NOMBRE', align: 'left', field: 'name' },
    { name: 'description', label: 'DESCRIPCIÓN', align: 'left', field: 'description' },
    {
        name: 'status',
        label: 'ESTADO',
        align: 'center',
        field: 'status',
        format: (val) => (val ? 'ACTIVO' : 'INACTIVO'),
    },
]);

const $q = useQuasar();

onBeforeMount(() => {
    fetchRequirements();
});

const fetchRequirements = async () => {
    try {
        const response = await getRequirementsApi(); // Usamos la función importada
        requirements.value = response.data;
    } catch (error) {
        console.error('Error al obtener los requerimientos:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al obtener los requerimientos.',
        });
    }
};

const openDialog = () => {
    dialog.value = true;
    newRequirement.value = { name: '', description: '', status: true }; // Reiniciar el formulario
};

const closeDialog = () => {
    dialog.value = false;
};

const saveRequirement = async () => {
    if (!newRequirement.value.name || !newRequirement.value.description) {
        $q.notify({
            type: 'warning',
            message: 'Por favor, completa todos los campos obligatorios.',
        });
        return;
    }
    try {
        await createRequirementApi(newRequirement.value); // Usamos la función importada
        $q.notify({
            type: 'positive',
            message: 'Requerimiento creado exitosamente.',
        });
        fetchRequirements();
        closeDialog();
    } catch (error) {
        console.error('Error al guardar el requerimiento:', error);
        $q.notify({
            type: 'negative',
            message: error.response ? `Error: ${error.response.data.message}` : 'Error al guardar el requerimiento.',
        });
    }
};
</script>

<style scoped>
h2 {
    color: rgb(4, 178, 217);
}
</style>