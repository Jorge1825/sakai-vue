<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Prompts</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                        @click="openDialog" class="q-mr-sm" />

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                        @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }"
                        @click="collapseAll" />
                </div>

            </div>
            <!-- Tabla de usuarios -->
            <DataTable v-model:expandedRows="expandedRows" :value="prompts" dataKey="_id" responsiveLayout="scroll"
                :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]">
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 15%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 35%" />
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
                           
                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                                @click="editPrompt(slotProps.data)" dense round />
                        </div>
                    </template>


                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Prompt: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
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

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="promptDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="savePrompt" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px;">
                                {{ prompt._id ? 'EDITAR ROL' : 'NUEVO ROL' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Nombre del prompt requerido']"
                                        v-model="prompt.name" label="Nombre del prompt" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']"
                                        v-model="prompt.description" label="Descripción" required style="padding: 10px"
                                        autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="prompt.status" :options="status" label="Estado" required
                                        style="padding: 10px" />
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
import { createPromptApi, editPromptApi, getPromptsApi, toggleActivePromptApi } from '@/api/prompts';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const prompts = ref([]);
const promptDialog = ref(false);
const prompt = ref({
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

onBeforeMount(async () => {
    await getPrompts();
});

async function getPrompts() {
    try {
        const { data } = await getPromptsApi();
        console.log(data);
        prompts.value = data.length ? data : [];

    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    prompt.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        status: status.value[0]
    };
    promptDialog.value = true;
}

function hideDialog() {
    promptDialog.value = false;
}

async function savePrompt() {
    console.log(prompt.value);

    if (prompt.value._id) {
        const promptApi = {
            id: prompt.value._id,
            name: prompt.value.name,
            description: prompt.value.description,
            status: prompt.value.status.value
        };

        const response = await editPromptApi(promptApi);

        if (response.status === 200) {
            Notify.create({ message: 'Prompt actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getPrompts();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el prompt.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const promptApi = {
            name: prompt.value.name,
            description: prompt.value.description,
            status: prompt.value.status.value
        };

        const response = await createPromptApi(promptApi);
        console.log(response);

        if (response.status === 200) {
            Notify.create({ message: 'Prompt creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getPrompts();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el prompt.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editPrompt(selectedPrompt) {
    prompt.value = { ...selectedPrompt };
    prompt.value.status = status.value.find((s) => s.value === selectedPrompt.status);
    promptDialog.value = true;
    console.log(prompt.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedPrompt) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActivePromptApi(selectedPrompt._id);

        if (response.status === 200) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedPrompt.status = selectedPrompt.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Prompt ${selectedPrompt.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedPrompt.status === 'Activo' ? 'blue' : 'red',//rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getPrompts();
        } else {
            throw new Error('Error al actualizar el estado del prompt.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado del prompt.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = prompts.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
