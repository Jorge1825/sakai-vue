<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Evaluar Normas y Requerimientos</strong>
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
            <!-- Tabla de empresas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="qualifications"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" />
                <Column field="requirement" header="REQUISITO" :sortable="true" style="width: 10%" />
                <Column field="norm" header="NORMA " :sortable="true" style="width: 15%" />
                <Column field="qualificaction" header="EVALUACIÓN" :sortable="true" style="width: 15%" />
                <Column field="evidence" header="EVIDENCIAS" :sortable="true" style="width: 15%" />
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
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editQualification(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Prompt: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Prompt:</strong> {{ slotProps.data.qualification }}</p>
                        <p><strong>Requerimiento:</strong>{{ slotProps.data.requirement }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Evaluacion:</strong> {{ slotProps.data.evaluation }}</p>
                        <p><strong>Evidencia:</strong>{{ slotProps.data.evidence }}</p>
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

    <!-- Modal para agregar/editar empresa -->
    <q-dialog v-model="qualificationDialog" persistent>
        <div class="container bg-white" style="width: 700px; max-width: 80vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                EVALUAR NORMA
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md">
                                <div class="col-12">
                                    <q-select v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" />
                                </div>
                                <div class="col-12 justify-center flex items-center q-py-lg">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn :disabled="!norm && !file" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog" />
                            <q-btn class="q-mx-sm" outline label="Cargar" color="primary" @click="uploadFile" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { getNormApi } from '@/api/norms';
import { createQualificationApi, editQualificationApi, getQualificationsApi, qualificationNormApi, toggleActiveQualificationApi, processRequirementsApi } from '@/api/qualifications';
import { notifyError, notifySuccess } from '@/config/notifications';
import { storeAuth } from '@/store/auth';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const qualifications = ref([]);
const qualificationDialog = ref(false);
const file = ref(null);
const norm = ref(null);
const norms = ref([null]);
const expandedRows = ref([]);

const normId = ref('');
const response = ref(null);

const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const useStoreAuth = storeAuth();

onBeforeMount(async () => {
    await getQualifications();
    await getNorms();
});

async function getQualifications() {
    try {
        const { data } = await getQualificationsApi();
        qualifications.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error al obtener datos de qualifications:", error);
        qualifications.value = []; // Asigna un array vacío para evitar futuros errores
    }
}

async function getNorms() {
    try {
        const { data } = await getNormApi();
        norms.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];
        norm.value = norms.value[0];
    } catch (error) {
        console.error(error);
    }
}

const selectFile = (event) => {
    file.value = event.target.files[0];
    uploadFileServer()
};

function openDialog() {
    norm.value = null
    qualificationDialog.value = true;
}

function hideDialog() {
    qualificationDialog.value = false;
}
// Función que dispara el click en el input de archivo
const uploadFile = () => { 
    const input = document.getElementById('inputFile'); 
    input.click(); 
}; 

async function uploadFileServer() {
    try {
        const formData = new FormData();
        formData.append('file', file.value);
        formData.append('normId', norm.value.value);
        formData.append('enterpriseId', '6730ea062850ba386d4dfa75');
        console.log('Archivo:', file.value);
        console.log('Norma:', norm.value);

        const response = await processRequirementsApi(file.value, norm.value.value);

        if (response.status <= 300) {
            Notify.create({ message: 'Norma evaluada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getQualifications();
            hideDialog();
        } else {
            notifySuccess({ message: 'Error al evaluar la norma.' });
        }

    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al actualizar la norma.' });
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = qualifications.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
