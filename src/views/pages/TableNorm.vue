<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6 flex items-center">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Tabla De Requisitos</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar -->
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />
                    <!-- Botón de expandir -->
                    <!-- <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" /> -->
                    <!-- Botón de colapsar -->
                    <!-- <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" /> -->
                </div>
            </div>
            <!-- Tabla de requias -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="requis"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="number" header="NUMERO" :sortable="true" style="width: 5%" />
                <Column field="norm" header="NORMA" style="width: 15%">
                    <template #body="slotNorms">
                        {{ slotNorms.data?.norm?.name }}
                    </template>
                </Column>
                <Column field="title" header="TITULO" style="width: 30%" />
                <!-- <Column field="renovation" header="RENOVACIÓN" style="width: 5%">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            {{ renovationOptions?.find((r) => r.value === slotProps.data?.renovation)?.label }}
                        </div>
                    </template>
                </Column> -->
                <!-- Columna de calificaciones (para números) -->
                <!-- <Column field="score" header="CALIFICACIONES" style="width: 5%">
          <template #body="slotNorms">
            <q-input v-model="slotNorms.data.score" type="number" dense />
          </template>
        </Column> -->
                <!-- <Column field="suggestedEvidence" header="SUGERENCIA DE EVIDENCIA " style="width: 10%">
                    <template #body="slotNorms">
                        {{ slotNorms.data }}
                    </template>
                </Column> -->
                <!-- Columna para el botón "ojo" en cada fila -->

                <Column field="objective" header="OBJETIVO" style="width: 25%" />
                <Column field="goal" header="META" style="width: 25%" />

                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotNorms">
                        <q-btn icon="visibility" :style="{ color: 'rgb(4, 178, 217)' }" @click="editRequirement(slotNorms.data?._id)" dense round />
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="requiDialog" width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ dataFormat._id ? 'EDITAR REQUERIMIENTO' : 'NUEVA REQUERIMIENTO' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md">
                                <div class="col-12">
                                    <q-select v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" />
                                </div>
                                <div class="col-12 justify-center flex items-center q-py-lg">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn :disabled="!norm" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                            </div>
                        </q-card-section>
                        <!-- <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md">
                                <div class="col-12">
                                    <q-select v-model="suggestedEvidence" :options="suggestedEvidences" label="Sugerencia de evidencia" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Sugerencia requerida']" />
                                </div>
                                <div class="col-12 justify-center flex items-center q-py-lg">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn :disabled="!suggestedEvidence" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                            </div>
                        </q-card-section> -->
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>

    <q-dialog v-model="responseIADialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">RESPUESTA</div>
                        </q-card-section>
                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                {{ textResponse }}
                            </div>
                        </q-card-section>
                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="closeResponse()" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>

    <q-dialog v-model="formatDialog" persistent>
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 45vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width q-pa-lg">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{
                                    dataFormat._id
                                        ? `EDITAR REQUISITOS - ${norm?.label}`
                                        : `NUEVOS REQUISITOS -
                                ${norm?.label}`
                                }}
                            </div>
                        </q-card-section>
                        <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md">
                                <div class="w-full q-px-md">
                                    <div class="text-bold">Objetivo</div>
                                    <q-input v-model="goal" outlined dense autogrow />
                                </div>
                                <div class="w-full q-px-md q-mt-md">
                                    <div class="text-bold">Meta:</div>
                                    <q-input v-model="objective" outlined dense autogrow />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-section class="req-editor">
                            <!-- Bloque por cada requisito (7.1, 7.2, ...) -->
                            <div v-for="(req, reqIndex) in dataFormat.requirements" :key="req._id" class="req-block">
                                <!-- Encabezado del requisito -->
                                <div class="req-header">
                                    <q-input v-model="req.number" dense outlined label="Número" class="req-number-input" />
                                    <q-input v-model="req.title" dense outlined label="Título del requisito" class="req-title-input" />
                                    <div class="req-header-actions">
                                        <q-btn round flat icon="control_point_duplicate" color="primary" size="sm" @click="addInput(req._id)">
                                            <q-tooltip>Agregar ítem</q-tooltip>
                                        </q-btn>
                                        <q-btn round flat icon="add_circle" color="green" size="sm" @click="addReq(req._id)">
                                            <q-tooltip>Nuevo requisito</q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>

                                <!-- Ítems del requisito (7.1.1, 7.1.2, ...) -->
                                <div class="req-items">
                                    <div v-for="(input, index) in req.inputs" :key="input._id" class="item-card">
                                        <span class="hidden">{{ (input.indicator = req.number + '.' + (index + 1)) }}</span>
                                        <div class="item-card-top">
                                            <q-badge color="primary" class="item-badge">{{ input.indicator }}</q-badge>
                                            <q-btn flat round dense icon="close" color="negative" size="sm" @click="removeInput(req._id, input._id)">
                                                <q-tooltip>Eliminar ítem</q-tooltip>
                                            </q-btn>
                                        </div>

                                        <q-input v-model="input.description" dense outlined type="textarea" autogrow label="Descripción del ítem" class="item-field" />

                                        <div class="item-row">
                                            <q-input v-model="input.value" type="number" dense outlined label="Valor / Peso (%)" class="item-value-input" />
                                            <q-select v-model="input.renovation" :options="renovationOptions" dense outlined label="Periodo / Tiempo" class="item-renov-input" />
                                        </div>

                                        <q-input v-model="input.suggestedEvidence" dense outlined type="textarea" autogrow label="Evidencia sugerida" class="item-field" />
                                    </div>
                                </div>
                            </div>

                            <!-- Total acumulado -->
                            <div class="req-total">
                                <span class="text-bold">TOTAL</span>
                                <q-badge color="primary" class="total-badge">{{ calculateTotal() }}</q-badge>
                            </div>
                        </q-card-section>
                        <q-card-section>
                            <div class="row full-width">
                                <div class="col-12">Nota: Para una correcta generación de evidencias por favor ubicar adecuadamente los requisitos primero y luego solitar las evidencias por IA</div>
                                <div class="col-4 justify-center flex items-center q-py-lg text-lg">Generar evidencias, meta y objetivo por IA:</div>
                                <div class="col-4 justify-start flex items-center q-py-lg q-px-md">
                                    <!-- <input type="file" id="inputFileEvidence" @change="selectFileEvidence" style="display: none" accept=".pdf" /> -->
                                    <q-btn label="Generar Información IA" color="primary" @click="selectFileEvidence" />
                                    <!-- <span class="text-sm text-grey-8">Solo se aceptan archivos PDF</span> -->
                                </div>
                                <div class="col-3 justify-start flex items-center">
                                    <span v-if="fileEvidence">{{ fileEvidence.name }}</span>
                                </div>

                                <!-- <div class="col-12 justify-center flex items-center q-py-lg">
                                    <q-btn :disabled="!norm" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div> -->
                            </div>
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="formatDialog = false" />
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
import { getNormsApi } from '@/api/norms';
import { createRequirementApi, editRequirementApi, formatDataRequirement, generateRequirementFile, getRequirementsApi } from '@/api/requirements';
import { generateEvidencesApi, getSuggestedEvidenceApi } from '@/api/suggestedEvidences';
import { useTaskPolling } from '@/composables/useTaskPolling';
import { Notify, useQuasar } from 'quasar';
import { onBeforeMount, ref } from 'vue';
const requis = ref([]);

const { isProcessing, startPolling, taskError, progress } = useTaskPolling();
const $q = useQuasar();

const requiDialog = ref(false);
const responseIADialog = ref(false);
const formatDialog = ref(false);
const norm = ref(null);
const norms = ref([]);
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const renovationOptions = ref([
    { label: 'Año fiscal', value: 0 },
    { label: 'Anual', value: 1 },
    { label: 'Bimensual', value: 2 },
    { label: 'Trimensual', value: 3 },
    { label: 'Semanal', value: 4 },
    { label: 'Mensual', value: 5 },
    { label: 'Permanente', value: 6 }
]);
const suggestedEvidences = ref([]);
let file = ref(null);
let fileEvidence = ref(null);
let textResponse = ref('');
let goal = ref('');
let objective = ref('');
let dataFormat = ref({
    number: '7',

    /*
Acciones preventivas y correctivas con base en los resultados del SG-SST (10%)	7.1.1 Definir acciones de Promoción y Prevención con base en resultados del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST
	7.1.2 Toma de medidas correctivas, preventivas y de mejora
	7.1.3 Ejecución de acciones preventivas, correctivas y de mejora de la investigación de incidentes, accidentes de trabajo y enfermedad laboral
	7.1.4 Implementar medidas y acciones correctivas de autoridades y de ARL
    */
    requirements: [
        {
            _id: 1,
            description: 'Acciones preventivas y correctivas con base en los resultados del SG-SST (10%)',
            number: '7.1',
            title: 'Acciones preventivas y correctivas con base en los resultados del SG-SST',
            inputs: [
                {
                    _id: 1,
                    description: 'Definir acciones de Promoción y Prevención con base en resultados del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST'
                },
                {
                    _id: 2,
                    description: 'Toma de medidas correctivas, preventivas y de mejora'
                },
                {
                    _id: 3,
                    description: 'Ejecución de acciones preventivas, correctivas y de mejora de la investigación de incidentes, accidentes de trabajo y enfermedad laboral'
                },
                {
                    _id: 4,
                    description: 'Implementar medidas y acciones correctivas de autoridades y de ARL'
                }
            ]
        }
    ],
    title: 'CONTEXTO DE LA ORGANIZACIÓN'
});

onBeforeMount(async () => {
    await getRequirements();
    await getNorms();
    await getSuggestedEvidence();
    // await formatData(text);
});

function calculateTotal() {
    let total = 0;
    dataFormat.value.requirements.forEach((r) => {
        r.inputs.forEach((i) => {
            total += parseFloat(i.value) || 0;
        });
    });
    return total;
}

// Función que dispara el click en el input de archivo
const uploadFile = () => {
    const input = document.getElementById('inputFile');
    input.click();
};

const uploadFileEvidence = () => {
    const input = document.getElementById('inputFileEvidence');
    input.click();
};

// Función que maneja la selección del archivo
const selectFile = (event) => {
    file.value = event.target.files[0];
    uploadFileServer();
};

const selectFileEvidence = async () => {
    //generar un array con todos los inputs de todos los requisitos
    let inputsReq = [];

    dataFormat.value.requirements.forEach((r) => {
        r.inputs.forEach((i) => {
            inputsReq.push({
                description: i.description,
                _id: i._id
            });
        });
    });

    const formData = new FormData();
    formData.append('inputs', JSON.stringify(inputsReq));

    try {
        const response = await generateEvidencesApi(formData);
        const taskId = response.data.taskId;

        const dismiss = $q.notify({
            message: 'Generando evidencias, metas y objetivos... Esto puede tardar unos minutos.',
            color: 'blue',
            timeout: 0, // No se cierra automáticamente
            actions: [{ label: 'Cerrar', color: 'white', handler: () => dismiss() }]
        });

        const result = await startPolling(taskId);

        //asignar las evidencias a cada input
        dataFormat.value.requirements.forEach((r) => {
            r.inputs.forEach((i) => {
                const evidence = result.response.find((e) => e.id == i._id);
                i.suggestedEvidence = evidence?.evidence.join('\n');
            });
        });
        
        goal.value = result.responseGoal?.goal;   
        objective.value = result.responseGoal?.objective;

        dismiss();

        Notify.create({
            message: `Generación de información exitosa.`,
            type: 'positive',
            position: 'top',
            color: 'green',
        });

    } catch (error) {
        fileEvidence.value = null;
        console.error(error);
        Notify.create({
            message: 'Hubo un error al generar información por IA: ' + error.message,
            type: 'negative',
            position: 'top',
            color: 'red',
        });
    }
};

async function getRequirements() {
    try {
        const { data } = await getRequirementsApi();
        console.log(data);
        requis.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}
async function getNorms() {
    try {
        const { data } = await getNormsApi();
        norms.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];
        norm.value = norms.value[2];
    } catch (error) {
        console.error(error);
    }
}

async function getSuggestedEvidence() {
    try {
        const { data } = await getSuggestedEvidenceApi();
        suggestedEvidences.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    norm.value = null;
    requiDialog.value = true;
}

function hideDialog() {
    formatDialog.value = false;
    fileEvidence.value = null;
}

async function saveNorm() {
    //dejar solo value de suggestedEvidence y renovation
    dataFormat.value.requirements.forEach((r) => {
        r.inputs.forEach((i) => {
            i.renovation = i.renovation?.value || null;
        });
    });
    if (dataFormat.value?._id) {
        const response = await editRequirementApi({
            ...dataFormat.value,
            id: dataFormat.value._id,
            norm: norm.value.value,
            goal: goal.value,
            objective: objective.value
        });

        if (response.status <= 300) {
            Notify.create({ message: 'Norma actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar las Norma.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        //eliminar el _id de los inputs
        dataFormat.value.requirements.forEach((r) => {
            delete r._id;
            r.inputs.forEach((i) => delete i._id);
        });

        const response = await createRequirementApi({
            norm: norm.value.value,
            ...dataFormat.value,
            goal: goal.value,
            objective: objective.value
        });
        console.log(response);
        if (response.status <= 300) {
            Notify.create({ message: 'Norma creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear la norma.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editRequirement(isReq) {
    goal.value = '';
    objective.value = '';
    dataFormat.value = requis.value.find((r) => r._id === isReq);
    norm.value = norms.value.find((n) => n.value === dataFormat.value.norm._id);

    //buscar el suggestedEvidence y el renovation en el array de suggestedEvidences y renovationOptions
    dataFormat.value.requirements.forEach((r) => {
        r.inputs.forEach((i) => {
            i.renovation = renovationOptions.value.find((s) => s.value == i.renovation);
        });
    });

    formatDialog.value = true;
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedRequeremet) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveRequeremetApi(selectedRequeremet._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedRequeremet.status = selectedRequeremet.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Requeremet${selectedRequeremet.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedRequeremet.status === 'Activo' ? 'blue' : 'rgb(242, 185, 179)', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getRequirements();
        } else {
            throw new Error('Error al actualizar el estado del rol.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado del rol.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'rgb(242, 185, 179)',
            multiLine: true
        });
    }
}

async function uploadFileServer() {
    requiDialog.value = false;
    const formData = new FormData();
    formData.append('normId', norm.value.value);
    formData.append('file', file.value);

    try {
        const response = await generateRequirementFile(formData);
        const taskId = response.data.taskId;

        Notify.create({
            message: `Extracción iniciada. Procesando en segundo plano...`,
            type: 'ongoing',
            position: 'top',
            color: 'blue',
        });

        const result = await startPolling(taskId);
        
        Notify.create({
            message: `Extracción de archivo exitosa.`,
            type: 'positive',
            position: 'top',
            color: 'green',
        });

        textResponse.value = result.text;
        responseIADialog.value = true;
        formatData(result.text);
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al extraer el archivo: ' + error.message,
            type: 'negative',
            position: 'top',
            color: 'red',
        });
    }
}

async function formatData(text) {
    try {
        const response = await formatDataRequirement({ text, normId: norm.value.value });
        const taskId = response.data.taskId;

        Notify.create({
            message: `Formateando información...`,
            type: 'ongoing',
            position: 'top',
            color: 'blue',
        });

        const result = await startPolling(taskId);

        Notify.create({
            message: `Operación exitosa. La norma ahora está ACTIVA.`,
            type: 'positive',
            position: 'top',
            color: 'green',
        });

        // The background task already saved requirements and updated norm status.
        // We reload from DB.
        await getRequirements();
        
        // Close dialogs
        formatDialog.value = false;
        responseIADialog.value = false;

    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al formatear la información: ' + error.message,
            type: 'negative',
            position: 'top',
            color: 'red',
        });
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = requis.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}

function closeResponse() {
    responseIADialog.value = false;
    formatDialog.value = true;
    fileEvidence.value = null;
}

function addInput(id) {
    const req = dataFormat.value.requirements.find((r) => r._id === id);
    req.inputs.push({ _id: req.inputs.length + 1, description: '' });
}

function removeInput(reqId, inputId) {
    const req = dataFormat.value.requirements.find((r) => r._id === reqId);
    //no remover el ultimo input
    if (req.inputs.length > 1) {
        const inputToRemove = req.inputs.findIndex((i) => i._id === inputId);
        //mover el contenido del input a remover al input anterior
        req.inputs[inputToRemove - 1].description += req.inputs[inputToRemove].description;
        req.inputs.splice(inputToRemove, 1);
    } else {
        //eliminar todo el requisito
        dataFormat.value.requirements = dataFormat.value.requirements.filter((r) => r._id !== reqId);
    }
}

function addReq(idCurrentReq) {
    //agrergar un nuevo requisito despues del requisito actual
    const index = dataFormat.value.requirements.findIndex((r) => r._id === idCurrentReq);
    dataFormat.value.requirements.splice(index + 1, 0, {
        _id: dataFormat.value.requirements.length + 1,
        description: '',
        number: '',
        title: '',
        inputs: [{ _id: 1, description: '' }]
    });
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

.hidden {
    display: none;
}

.req-editor {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Bloque de un requisito (7.1, 7.2, ...) */
.req-block {
    background: #fafbfc;
    border: 1px solid #e3e8ee;
    border-radius: 12px;
    padding: 16px;
}

.req-header {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #dfe3e8;
}

.req-number-input {
    width: 90px;
    flex-shrink: 0;
}

.req-title-input {
    flex: 1;
    min-width: 200px;
}

.req-header-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
}

/* Lista de ítems dentro del requisito */
.req-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

/* Card individual de cada ítem (7.1.1, 7.1.2, ...) */
.item-card {
    background: #ffffff;
    border: 1px solid #e3e8ee;
    border-radius: 10px;
    padding: 14px;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    transition: box-shadow 0.15s ease, border-color 0.15s ease;
}

.item-card:hover {
    border-color: rgb(4, 178, 217);
    box-shadow: 0 2px 8px rgba(4, 178, 217, 0.12);
}

.item-card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.item-badge {
    font-size: 13px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 6px;
}

.item-field {
    width: 100%;
    margin-bottom: 10px;
}

.item-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.item-value-input {
    width: 150px;
    flex-shrink: 0;
}

.item-renov-input {
    flex: 1;
    min-width: 160px;
}

/* Total acumulado al pie */
.req-total {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 14px 4px;
    border-top: 1px solid #e3e8ee;
    font-size: 18px;
}

.total-badge {
    font-size: 18px;
    font-weight: 700;
    padding: 4px 16px;
    border-radius: 8px;
    min-width: 56px;
    text-align: center;
}

@media (max-width: 600px) {
    .req-header {
        flex-direction: column;
        align-items: stretch;
    }

    .req-number-input,
    .req-title-input,
    .item-value-input,
    .item-renov-input {
        width: 100%;
    }
}
</style>
