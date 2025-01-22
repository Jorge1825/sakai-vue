<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong> Evaluaciones Express </strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de usuarios -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="express"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="enterprise" header="EMPRESA" :sortable="true" style="width: 70%">
                    <template #body="slotProps">
                        <div>
                            {{ slotProps.data.enterprise.name }}
                        </div>
                    </template>
                </Column>
                <Column field="percentage" header="PORCENTAJE" style="width: 30%; text-align: left; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            <q-chip :color="slotProps.data.percentage < 60 ? 'red-2' : slotProps.data.percentage < 80 ? 'yellow-8' : 'green'" :label="slotProps.data.percentage + '%'" />
                        </div>
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 5%">
                    <template #body="slotProps">
                        <div class="button-group flex justify-center">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="visibility" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">

                        <h5>Detalles del Diagnostico</h5>
                        <p>
                            <strong>Empresa:</strong>
                            {{ slotProps.data.enterprise.name }}
                        </p>
                        <p><strong>Resultado:</strong> {{ slotProps.data.percentage }} %</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="promptDialog" persistent>
        <div class="container bg-white" style="width: 700px; max-width: 80vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <div class="row full-width q-my-lg">
                        <div class="col-12 row q-px-xl q-py-lg">
                            <div class="col-12 text-center">
                                <span class="text-xl text-primary">
                                    Evaluación Express
                                    {{ selectedExpress?.enterprise?.name }}
                                </span>
                            </div>
                            <div class="col-12 row q-mt-md">
                                <div class="col-12 text-xl text-center text-bold">
                                    Resultados obtenidos:

                                    <span class="col-2 text-lg" :class="selectedExpress?.percentage < 60 ? 'text-red' : selectedExpress?.percentage < 80 ? 'text-yellow-8' : 'text-green'">{{ selectedExpress?.percentage }} %</span>
                                </div>
                            </div>
                            <div class="q-mt-xl text-sm col-12 row">
                                <template v-for="question in selectedExpress?.questions">
                                    <div class="col-12 q-pt-lg" :class="question.cumple ? 'text-green' : 'text-red'">
                                        <span v-html="question.text"></span>
                                    </div>
                                </template>
                            </div>
                        </div>
                        <div class="col-12 justify-center flex q-mt-lg">
                            <div class="button-group flex justify-center q-mt-lg">
                                <q-btn label="Cerrar" color="primary" @click="hideDialog" />
                            </div>
                        </div>
                    </div>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { getEvaluationExpress } from '@/api/norms';
import { storeAuth } from '@/store/auth';
import { onBeforeMount, ref } from 'vue';

const useStoreAuth = storeAuth();

const express = ref([]);
const promptDialog = ref(false);
const selectedExpress = ref(null);
const expandedRows = ref([]);

const company = ref(null);

onBeforeMount(async () => {
    company.value = useStoreAuth.getSelectedCompany();
    await getExpress();
});

async function getExpress() {
    try {
        const { data } = await getEvaluationExpress(company.value.value);
        console.log(data);
        express.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog(evaluationExpress) {
    selectedExpress.value = evaluationExpress;
    promptDialog.value = true;
}

function hideDialog() {
    promptDialog.value = false;
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = express.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
    top: 25vh;
    width: 300px;
    height: 300px;
    background-image: url('../../assets/sosteniweb/logo_negro.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: -1;
}
</style>
