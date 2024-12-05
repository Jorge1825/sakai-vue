<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>DIAGNOSTICO</strong>
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
            <!-- Tabla de diagnosticos -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="diagnostics"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 10%" />
                <Column field="norm" header="NORMA" style="width: 10%"/>
                <Column field="requirement" header="REQUERIMIENTO" style="width: 10%" />
                <Column field="levelOfCompliance" header="NIVEL DE CUMPLIMIENTO" style="width: 10%" />
                <Column field="enterprise" header="EMPRESA" style="width: 10%" />
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
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editDiagnostic(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del diagnostico: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Requerimiento:</strong> {{ slotProps.data.requirement }}</p>
                        <p><strong>Nivel de cumplimento:</strong> {{ slotProps.data.levelOfCompliance }}</p>\
                        <p><strong>Empresa:</strong> {{ slotProps.data.enterprise }}</p>
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

    <!-- Modal para agregar/editar diagnostico -->
    <q-dialog v-model="diagnosticDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveDiagnostic" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ diagnostic._id ? 'EDITAR DIAGNOSTICO' : 'NUEVO DIAGNOSTICO' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del diagnostico requerido']" v-model="diagnostic.name" label="Nombre del diagnostico" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="diagnostic.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma']" v-model="diagnostic.norm" label="Norma" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requerimiento']" v-model="diagnostic.requirement" label="Requerimiento" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input type="number" lazy-rules :rules="[(val) => (!isNaN(val) && val !== null && val !== '') || 'Debe ser un número decimal válido']" v-model.number="diagnostic.levelOfCompliance" label="Nivel de cumplimiento del requerimiento" required style="padding: 10px" autogrow
                                    />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Empresa']" v-model="diagnostic.enterprise" label="Empresa" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="diagnostic.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { createDiagnosticApi, editDiagnosticApi, getDiagnosticApi, toggleActiveDiagnosticApi } from '@/api/diagnostics'; //ROLES
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const diagnostics = ref([]);
const diagnosticDialog = ref(false);
const diagnostic = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    requirement: '',
    levelOfCompliance: 0,
    enterprise: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

onBeforeMount(async () => {
    await getDiagnostic();
});

async function getDiagnostic() {
    try {
        const { data } = await getDiagnosticApi();
        console.log(data);
        diagnostics.value = data.length ? data : [];

        console.log(diagnostics.value);
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    diagnostic.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norm: '',
        requirement: '',
        levelOfCompliance: 0,
        enterprise: '',
        status: true
    };
    diagnosticDialog.value = true;
}

function hideDialog() {
    diagnosticDialog.value = false;
}

async function saveDiagnostic() {
    console.log(diagnostic.value);

    if (diagnostic.value._id) {
        const diagnosticApi = {
            id: diagnostic.value._id,
            name: diagnostic.value.name,
            description: diagnostic.value.description,
            norm: diagnostic.value.norm,
            requirement: diagnostic.value.requirement,
            levelOfCompliance: diagnostic.value.levelOfCompliance,
            enterprise: diagnostic.value.enterprise,
            status: diagnostic.value.status
        };

        const response = await editDiagnosticApi(diagnosticApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Diagnostico actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getDiagnostic();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el diagnostico.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const diagnosticApi = {
            name: diagnostic.value.name,
            description: diagnostic.value.description,
            norm: diagnostic.value.norm,
            requirement: diagnostic.value.requirement,
            levelOfCompliance: diagnostic.value.levelOfCompliance,
            enterprise: diagnostic.value.enterprise,
            status: diagnostic.value.status
        };

        const response = await createDiagnosticApi(diagnosticApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Diagnostico creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getDiagnostic();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el diagnostico.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editDiagnostic(selectedDiagnostic) {
    diagnostic.value = { ...selectedDiagnostic };
    diagnosticDialog.value = true;
    console.log(diagnostic.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedDiagnostic) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveDiagnosticApi(selectedDiagnostic._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedDiagnostic.status = !selectedDiagnostic.status;

            // Mostrar notificación de éxito
            Notify.create({
                message: `Diagnostico ${selectedDiagnostic.status ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedDiagnostic.status ? 'blue' : 'red', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getDiagnostic();
        } else {
            throw new Error('Error al actualizar el estado del diagnostico.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la actividad.',
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
    expandedRows.value = diagnostics.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
