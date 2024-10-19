<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Requisitos</strong>
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
            <DataTable v-model:expandedRows="expandedRows" :value="requirements " dataKey="_id" responsiveLayout="scroll"
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
                            <q-btn :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'red' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleStatus(slotProps.data)" dense round class="q-mr-xs" />
                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                                @click="editRequirement(slotProps.data)" dense round />
                        </div>
                    </template>


                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del requisto: {{ slotProps.data.name }}</h5>
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
    <q-dialog v-model="dialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveRequirement" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px;">
                                {{ newRequirement._id ? 'EDITAR REQUISITO' : 'NUEVO REQUISITO' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width  q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Nombre del requisito requerido']"
                                        v-model="newRequirement.name" label="Nombre del requisito" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']"
                                        v-model="newRequirement.description" label="Descripción" required style="padding: 10px"
                                        autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="newRequirement.status" :options="status" label="Estado" required
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
import { ref, onBeforeMount } from 'vue';
import { useQuasar, Notify } from 'quasar';
import { getRequirementsApi, createRequirementApi, editRequirementApi, toggleActiveRequirementApi, /*deleteRequirementApi*/ } from '@/api/requirements'; // Importa las funciones API

const requirements = ref([]);
const dialog = ref(false);
const newRequirement = ref({
    id: null,
    name: '',
    description: '',
    status: true,
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

const $q = useQuasar();

onBeforeMount(async() => {
    await fetchRequirements();
});

const fetchRequirements = async () => {
    try {
        const response = await getRequirementsApi(); // Usamos la función importada
        requirements.value = response.data;
    } catch (error) {
        console.error('Error al obtener los requisitos:', error);
        $q.notify({
            type: 'negative',
            message: 'Error al obtener los requisitos.',
        });
    }
};

const openDialog = () => {
    dialog.value = true;
    newRequirement.value = { id: null, name: '', description: '', status: status.value[0] };
};

const hideDialog = () => {
    dialog.value = false;
};

async function saveRequirement() {

    if (newRequirement.value._id) {
        const requirementApi = {
            id: newRequirement.value._id,
            name: newRequirement.value.name,
            description: newRequirement.value.description,
            status: newRequirement.value.status.value
        };

        const response = await editRequirementApi(requirementApi);
        console.log(response.status);
        
        if (response.status === 200) {
            Notify.create({ message: 'Requisito actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await fetchRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el requisito.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const requirementApi = {
            name: newRequirement.value.name,
            description: newRequirement.value.description,
            status: newRequirement.value.status.value
        };

        const response = await createRequirementApi(requirementApi);
        console.log(response);

        if (response.status === 200) {
            Notify.create({ message: 'Requerimiento creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await fetchRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el requerimiento.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

const editRequirement = (requirement) => {
    newRequirement.value = { ...requirement };
    console.log(newRequirement.value);
    newRequirement.value.status = status.value.find((s) => s.value === requirement.status);
    dialog.value = true;
};

async function toggleStatus(selectedRequirement) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveRequirementApi(selectedRequirement._id);

        if (response.status === 200) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedRequirement.status = selectedRequirement.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Requisito ${selectedRequirement.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedRequirement.status === 'Activo' ? 'blue' : 'red',//rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await fetchRequirements();
        } else {
            throw new Error('Error al actualizar el estado del requisito.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado del requisito.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}
function expandAll() {
    expandedRows.value = requirements.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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