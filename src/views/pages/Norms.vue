<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>NORMAS</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de normas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="norms"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 20%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 20%" />
                <Column field="status" header="ESTADO" style="width: 10%; text-align: left; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            <q-badge :color="slotProps.data.status === true ? 'blue' : 'red'" class="q-ml-xs">
                                {{ status.find((s) => s.value === slotProps.data.status).label }}
                            </q-badge>
                        </div>
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->
                            <q-btn
                                v-if="Roles.type == 'ADMIN'"
                                :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'red' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleStatus(slotProps.data)"
                                dense
                                round
                                class="q-mr-xs"
                            />
                            <q-btn
                                v-if="role.type == 'USER'"
                                :icon="existEnterprise(slotNorms.data) ? 'check' : 'clear'"
                                :style="{ backgroundColor: !existEnterprise(slotNorms.data) ? 'red' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleEnterprise(slotNorms.data)"
                                dense
                                round
                                class="q-mr-xs"
                            />
                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editNorms(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles de la norma: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p>
                            <strong>Prompt de extracción:</strong>
                            {{ selectPrompt(slotNorms.data.promptExtraction?._id) }}
                        </p>
                        <p>
                            <strong>Prompt de formato:</strong>
                            {{ selectPrompt(slotNorms.data.promptFormat?._id) }}
                        </p>
                        <p>
                            <strong>Estado:</strong>
                            <q-badge :color="slotProps.data.status === true ? 'blue' : 'red'">
                                {{ status.find((s) => s.value === slotProps.data.status).label }}
                            </q-badge>
                        </p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar norma -->
    <q-dialog v-model="normDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ norm._id ? 'EDITAR NORMA' : 'NUEVA NORMA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre de la norma requerido']" v-model="norm.name" label="Nombre de la norma" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="norm.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="norm.promptExtraction" :options="prompts" label="Prompt de extracción" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Prompt de extracción requerido']" />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="norm.promptFormat" :options="prompts" label="Prompt de formato" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Prompt de formato requerido']" />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="norm.status" :options="status" label="Estado" required style="padding: 10px" />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog" />
                            <q-btn class="q-mx-sm" outline label="Guardar" color="primary" type="submit" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
</template>
<script setup>
import { createNormApi, editNormApi, getNormApi, toggleActiveNormApi } from '@/api/norms';
import { getPromptsApi } from '@/api/prompts';
import { storeAuth } from '@/store/auth';
import { notifyError, notifySuccess } from '@/config/notifications';
import { onBeforeMount, ref, computed } from 'vue'; // Asegúrate de importar computed

const norms = ref([]);
const normDialog = ref(false);
const norm = ref({
    id: null,
    name: '',
    description: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

const { Roles } = storeAuth; // Asegúrate de que Roles esté definido correctamente
const enterprise = ref({ value: '' }); // Asegúrate de que enterprise esté definido correctamente

onBeforeMount(async () => {
    await getNorm();
});

async function getNorm() {
    try {
        const { data } = await getNormApi();
        console.log(data);
        norms.value = data.length ? data : [];

        console.log(norms.value);
    } catch (error) {
        console.error(error);
    }
}

async function getPrompts() {
    try {
        const { data } = await getPromptsApi();
        console.log(data);
        prompts.value = data.map((p) => ({ label: p.name, value: p._id, description: p.description }));
    } catch (error) {
        console.error(error);
    }
}

//crear computed para seleccionar prompt

const selectPrompt = computed(() => (id) => {
    const prompt = prompts.value.find((p) => p.value === id);
    return prompt ? `${prompt.label} - ${prompt.description}` : '';
});

async function getNorms() {
    try {
        const { data } = await getNormsApi();
        console.log(data);
        norms.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    norm.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        status: status.value[0]
    };
    normDialog.value = true;
}

function hideDialog() {
    normDialog.value = false;
}

async function saveNorm() {
    console.log(norm.value);

    if (norm.value._id) {
        const normApi = {
            id: norm.value._id,
            name: norm.value.name,
            description: norm.value.description,
            status: norm.value.status.value
        };

        const response = await editNormApi(normApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Norma actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getNorm();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar la norma.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const normApi = {
            name: norm.value.name,
            description: norm.value.description,
            status: norm.value.status.value
        };

        const response = await createNormApi(normApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Norma creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getNorm();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear la norma.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editNorm(selectedNorm) {
    norm.value = { ...selectedNorm };
    norm.value.status = status.value.find((s) => s.value === selectedNorm.status);
    normDialog.value = true;
    console.log(norm.value);
}

//funcion activar desactivar norma
async function toggleStatus(selectedNorm) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveNormApi(selectedNorm._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedNorm.status = selectedNorm.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Norma ${selectedNorm.status === 'Activo' ? 'activada' : 'desactivada'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedNorm.status === 'Activo' ? 'blue' : 'red', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getNorm();
        } else {
            throw new Error('Error al actualizar el estado de la norma.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la norma.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}

//funcion activar desactivar usuario
async function toggleEnterprise(selectedNorm) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveNormApi({ id: selectedNorm._id, enterprise: enterprise.value });

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedNorm.status = selectedNorm.status === 'Activo' ? 'Inactivo' : 'Activo';

            notifySuccess({
                message: `Norma ${selectedNorm.status === 'Activo' ? 'activada' : 'desactivada'} correctamente.`,
                color: selectedNorm.status === 'Activo' ? 'blue' : 'red'
            });

            // Vuelve a cargar los usuarios si es necesario
            await getNorms();
        } else {
            throw new Error('Error al actualizar el estado de la norma.');
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al actualizar el estado de la norma.' });
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = norms.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}

</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    /* Espacio entre los botones */
}

.watermark-container {
    position: relative;
    z-index: 1;
}

.watermark {
    position: absolute;
    bottom: 10px;
    width: 300px;
    height: 300px;
    background-image: url('../../assets/sosteniweb/logo_negro.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: -1;
}
</style>