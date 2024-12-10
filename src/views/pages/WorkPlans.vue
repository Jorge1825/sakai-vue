<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>PLAN DE TRABAJO</strong>
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
            <!-- Tabla de plan de trabajo  -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="workPlans"
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
                <Column field="pendingRequirementsCount" header="CANTIDAD DE REQUISITOS PENDIENTES" style="width: 15%" />
                <Column field="generationDate" header="FECHA DE GENERACIÓN" style="width: 10%" />
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
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editWorkPlan(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del plan de trabajo: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Cantidad de requisitos pendientes:</strong> {{ slotProps.data.pendingRequirementsCount }}</p>
                        <p><strong>Fecha de generación:</strong> {{ formatDate(slotProps.data.generationDate) }}</p>
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

    <!-- Modal para agregar/editar plan de trabajo -->
    <q-dialog v-model="workPlanDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveWorkPlan" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ workPlan._id ? 'EDITAR PLAN DE TRABAJO' : 'NUEVO PLAN DE TRABAJO' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del plan de trabajo']" v-model="workPlan.name" label="Nombre del plan de trabajo" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="workPlan.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma requerida']" v-model="workPlan.norm" label="Norma" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input type="date" lazy-rules :rules="[(val) => (val && val.length > 0) || 'Fecha de generación requerida']" v-model="workPlan.generationDate" label="Fecha de generación" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input type="number" lazy-rules :rules="[(val) => (!isNaN(val) && val !== null && val !== '') || 'Debe ser un número válido']" v-model.number="workPlan.pendingRequirementsCount" label="Cantidad de requisitos pendientes" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="workPlan.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { createWorkPlanApi, editWorkPlanApi, getWorkPlanApi, toggleActiveWorkPlanApi } from '@/api/worksPlans.js'; //ROLES
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const workPlans = ref([]);
const workPlanDialog = ref(false);
const workPlan = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    generationDate: '',
    pendingRequirementsCount: 0,
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

onBeforeMount(async () => {
    await getWorkPlan();
});

async function getWorkPlan() {
    try {
        const { data } = await getWorkPlanApi();
        console.log(data);
        workPlans.value = data.length ? data : [];

        console.log(workPlans.value);
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    workPlan.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norm: '',
        generationDate: '',
        pendingRequirementsCount: 0,
        status: status.value[0]
    };
    workPlanDialog.value = true;
}

function hideDialog() {
    workPlanDialog.value = false;
}

async function saveWorkPlan() {
    console.log(workPlan.value);

    if (workPlan.value._id) {
        const workPlanApi = {
            id: workPlan.value._id,
            name: workPlan.value.name,
            description: workPlan.value.description,
            norm: workPlan.value.norm,
            generationDate: workPlan.value.generationDate,
            pendingRequirementsCount: workPlan.value.pendingRequirementsCount,
            status: workPlan.value.status.value
        };

        const response = await editWorkPlanApi(workPlanApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Plan de trabajo actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getWorkPlan();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el plan de trabajo.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const workPlanApi = {
            name: workPlan.value.name,
            description: workPlan.value.description,
            norm: workPlan.value.norm,
            generationDate: workPlan.value.generationDate,
            pendingRequirementsCount: workPlan.value.pendingRequirementsCount,
            status: workPlan.value.status.value
        };

        const response = await createWorkPlanApi(workPlanApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Plan de trabajo creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getWorkPlan();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el plan de trabajo.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editWorkPlan(selectedWorkPlan) {
    workPlan.value = { ...selectedWorkPlan };
    workPlan.value.status = status.value.find((s) => s.value === selectedWorkPlan.status);
    workPlanDialog.value = true;
    console.log(workPlan.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedWorkPlan) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveWorkPlanApi(selectedWorkPlan._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedWorkPlan.status = selectedWorkPlan.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Plan de trabajo ${selectedWorkPlan.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedWorkPlan.status === 'Activo' ? 'blue' : 'red', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getWorkPlan();
        } else {
            throw new Error('Error al actualizar el estado del plan de trabajo.');
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
    expandedRows.value = workPlans.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
