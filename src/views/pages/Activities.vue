<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>ACTIVIDADES</strong>
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
            <!-- Tabla de actividades -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="activities"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 20%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 20%" />
                <Column field="norm" header="NORMA" style="width: 20%" />
                <Column field="requirement" header="REQUERIMIENTO" style="width: 20%" />
                <Column field="fieldvalue" header="VALOR" style="width: 10%" />
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
                                :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'red' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleStatus(slotProps.data)"
                                dense
                                round
                                class="q-mr-xs"
                            />
                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editActivity(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles de la actividad: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Requerimiento:</strong> {{ slotProps.data.requirement }}</p>
                        <p><strong>Valor:</strong> {{ slotProps.data.fieldvalue }}</p>
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

    <!-- Modal para agregar/editar actividad -->
    <q-dialog v-model="activityDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveActivity" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ activity._id ? 'EDITAR ACTIVIDAD' : 'NUEVA ACTIVIDAD' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre de la actividad requerido']" v-model="activity.name" label="Nombre de la actividad" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="activity.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma']" v-model="activity.norm" label="Norma" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requerimiento']" v-model="activity.requirement" label="Requerimiento" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input type="number" lazy-rules :rules="[(val) => (!isNaN(val) && val !== null && val !== '') || 'Debe ser un número decimal válido']" v-model.number="activity.fieldvalue" label="Valor" required style="padding: 10px" autogrow
                                    />
                                </div>

                                <div class="col-6">
                                    <q-select v-model="activity.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { createActivityApi, editActivityApi, getActivityApi, toggleActiveActivityApi } from '@/api/activities'; //ROLES
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const activities = ref([]);
const activityDialog = ref(false);
const activity = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    requirement: '',
    fieldvalue: 0,
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

onBeforeMount(async () => {
    await getActivity();
});

async function getActivity() {
    try {
        const { data } = await getActivityApi();
        console.log(data);
        activities.value = data.length ? data : [];

        console.log(activities.value);
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    activity.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norm: '',
        requirement: '',
        fieldvalue: 0,
        status: status.value[0]
    };
    activityDialog.value = true;
}

function hideDialog() {
    activityDialog.value = false;
}

async function saveActivity() {
    console.log(activity.value);

    if (activity.value._id) {
        const activityApi = {
            id: activity.value._id,
            name: activity.value.name,
            description: activity.value.description,
            norm: activity.value.norm,
            requirement: activity.value.requirement,
            fieldvalue: activity.value.fieldvalue,
            status: activity.value.status.value
        };

        const response = await editActivityApi(activityApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Actividad actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getActivity();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el actividad.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const activityApi = {
            name: activity.value.name,
            description: activity.value.description,
            norm: activity.value.norm,
            requirement: activity.value.requirement,
            fieldvalue: activity.value.fieldvalue,
            status: activity.value.status.value
        };

        const response = await createActivityApi(activityApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Actividad creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getActivity();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear la actividad.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editActivity(selectedActivity) {
    activity.value = { ...selectedActivity };
    activity.value.status = status.value.find((s) => s.value === selectedActivity.status);
    activityDialog.value = true;
    console.log(activity.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedActivity) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveActivityApi(selectedActivity._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedActivity.status = selectedActivity.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Actividad ${selectedActivity.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedActivity.status === 'Activo' ? 'blue' : 'red', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getActivity();
        } else {
            throw new Error('Error al actualizar el estado de la actividad.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la actvidad.',
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
    expandedRows.value = activities.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
