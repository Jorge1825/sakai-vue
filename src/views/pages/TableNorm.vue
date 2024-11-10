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
                    <!-- <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" /> -->
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
                <Column field="number" header="NUMBERO" :sortable="true" style="width: 5%" />
                <Column field="title" header="TITULO" style="width: 80%" />
          
                <!-- Columna de calificaciones (para números) -->
                <!-- <Column field="score" header="CALIFICACIONES" style="width: 5%">
          <template #body="slotNorms">
            <q-input v-model="slotNorms.data.score" type="number" dense />
          </template>
        </Column> -->
                <!-- Columna para el botón "ojo" en cada fila -->
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
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 60vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ dataFormat._id ? `EDITAR REQUISITOS - ${norm?.label}` : `NUEVOS REQUISITOS - ${norm?.label}` }}
                            </div>
                        </q-card-section>

                        <q-card-section class="overflow-auto">
                            <table class="tablereq">
                                <thead>
                                    <tr>
                                        <th class="col-number">Número</th>
                                        <th class="col-title">Título</th>
                                        <th class="col-requirements" colspan="3">Requisitos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="col-number">{{ dataFormat.number }}</td>
                                        <td class="col-title">
                                            <q-input v-model="dataFormat.title" dense autogrow />
                                        </td>
                                        <td class="col-requirements" colspan="3">
                                            <table class="tablereq">
                                                <thead>
                                                    <tr>
                                                        <th class="col-req-number">Número de Requisito</th>
                                                        <th class="col-req-title">Título de Requisito</th>
                                                        <th class="col-req-description">Descripción de Requisito</th>
                                                        <th class="col-value">Valor</th>
                                                        <th class="col-actions">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="req in dataFormat.requirements" :key="req.number">
                                                        <td class="col-req-number">
                                                            <q-input v-model="req.number" dense autogrow />
                                                        </td>
                                                        <td class="col-req-title">
                                                            <q-input v-model="req.title" dense autogrow />
                                                        </td>
                                                        <td class="col-req-description">
                                                            <template v-for="input in req.inputs" :key="input._id">
                                                                <q-input v-model="input.description" dense autogrow>
                                                                    <template v-slot:append>
                                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInput(req._id, input._id)" />
                                                                    </template>
                                                                </q-input>
                                                            </template>
                                                        </td>
                                                        <td class="col-value">
                                                            <template v-for="input in req.inputs" :key="input._id">
                                                                <q-input v-model="input.value" type="number" dense autogrow />
                                                            </template>
                                                        </td>
                                                        <td class="col-actions">
                                                            <q-btn icon="control_point_duplicate" :style="{ color: 'rgb(4, 178, 217)' }" @click="addInput(req._id)" dense round />

                                                            <q-btn class="q-mx-sm" icon="add_circle" :style="{ color: '#32a600' }" @click="addReq(req._id)" dense round />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const requis = ref([
    // Datos de ejemplo
    { _id: 1, name: '001/6503', description: 'Norma de seguridad', requirements: 'La requia de seguridad dicta que.....', score: 0 },
    { _id: 2, name: '002/6504', description: 'Norma de calidad', requirements: 'La requia de calidad dicta que.....', score: 0 },
    { _id: 3, name: '003/6505', description: 'Norma de ambiente', requirements: 'La requia de ambeinte dicta que.....', score: 0 }
]);

const requiDialog = ref(false);
const responseIADialog = ref(false);
const formatDialog = ref(true);
const norm = ref(null);
const norms = ref([]);
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
let file = ref(null);
let textResponse = ref('');
let dataFormat = ref({
    number: '4',
    requirements: [
        {
            _id: 1,
            description:
                'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la sostenibilidad de eventos.\nNOTA 1 El término "cuestión" en este subnumeral es sinónimo de "contexto" según se define en el numeral 3.42.\nNOTA 2 La organización es la que se describe en los numerales 4.3 y 4.4.',
            number: '4.1',
            title: 'Comprensión de la organización y de su contexto',
            inputs: [{ _id: 1, description: 'Requisito 1' }]
        },
        {
            _id: 2,
            description:
                'La organización debe determinar:\n- las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1;\n- los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).\nLa organización debe establecer, implementar y mantener un procedimiento para la identificación y compromiso de las partes interesadas en las cuestiones de desarrollo sostenible identificados y emergentes relacionados con su rol en la cadena de valor de los eventos. La organización debe documentar los resultados de su compromiso con las partes interesadas.\nLa identificación de las partes interesadas debe abarcar, cuando proceda, lo siguiente:\na) el organizador de evento;\nb) el propietario del evento;\nc) la fuerza laboral;\nd) la cadena de suministro;\ne) los participantes;\nf) los asistentes;\ng) los organismos reguladores;\nh) la comunidad.\ni) organizaciones no gubernamentales que velen por el ambiente, la cultura y el patrimonio',
            number: '4.2',
            title: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            inputs: [
                { _id: 1, description: 'Requisito 1', value: 1 },
                { _id: 2, description: 'Requisito 2', value: 1 },
                { _id: 3, description: 'Requisito 3' }
            ]
        },
        {
            _id: 3,
            description:
                'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la sostenibilidad de eventos a fin de establecer su alcance.\nAl determinar este alcance, la organización debe considerar:\n- las cuestiones externas e internos mencionados en el numeral 4.1; y\n- los requisitos a los que se hace referencia en el numeral 4.2.\nEl alcance debe estar disponible como información documentada.',
            number: '4.3',
            title: 'Determinación del alcance del sistema de gestión de la sostenibilidad de eventos',
            inputs: [
                { _id: 1, description: 'Requisito 1' },
                { _id: 2, description: 'Requisito 2' }
            ]
        },
        {
            _id: 4,
            description:
                'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de sostenibilidad para eventos, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de la presente Norma.',
            number: '4.4',
            title: 'Sistema de gestión de la sostenibilidad de eventos',
            inputs: [
                { _id: 1, description: 'Requisito 1' },
                { _id: 2, description: 'Requisito 2' }
            ]
        },
        {
            _id: 5,
            description:
                'La organización debe definir sus principios rectores del desarrollo sostenible en forma de una declaración de propósitos y valores. Los principios rectores del desarrollo sostenible de la organización en relación con la gestión de eventos deben incluir, como mínimo, consideraciones de compromiso, inclusión, integridad y transparencia. La organización debe definir y documentar su propósito principal y sus valores con respecto a sus actividades, productos y servicios relacionados específicamente con los eventos.\nLos principios, el propósito y los valores de la organización deben proporcionar un marco para establecer sus políticas, objetivos y metas, tal como se definen en el alcance de su sistema de gestión de la sostenibilidad de eventos.',
            number: '4.5',
            title: 'Principios de desarrollo sostenible, declaración de propósitos y valores',
            inputs: [
                { _id: 1, description: 'Requisito 1' },
                { _id: 2, description: 'Requisito 2' }
            ]
        }
    ],
    title: 'CONTEXTO DE LA ORGANIZACIÓN'
});

onBeforeMount(async () => {
    await getRequirements();
    await getNorms();
    // await formatData(text);
});

// Función que dispara el click en el input de archivo
const uploadFile = () => {
    const input = document.getElementById('inputFile');
    input.click();
};

// Función que maneja la selección del archivo
const selectFile = (event) => {
    file.value = event.target.files[0];
    uploadFileServer();
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
        norm.value = norms.value[0];
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
}

async function saveNorm() {
    if (dataFormat.value?._id) {
        const response = await editRequirementApi(dataFormat.value);

        if (response.status <= 300) {
            Notify.create({ message: 'Norma actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar las Norma.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const response = await createRequirementApi({ norm: norm.value.value, ...dataFormat.value });
        console.log(response);
        if (response.status <= 300) {
            Notify.create({ message: 'Norma creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRequirements();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear la norma.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editRequirement(isReq) {
    dataFormat.value = requis.value.find((r) => r._id === isReq);
    norm.value = norms.value.find((n) => n.value === dataFormat.value.norm);
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
                color: selectedRequeremet.status === 'Activo' ? 'blue' : 'red', //rgb(4, 178, 217)
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
            color: 'red',
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
        // Cambia el estado del usuario (activo/inactivo)
        const response = await generateRequirementFile(formData);

        console.log(response);

        if (response.status <= 300) {
            // Mostrar notificación de éxito
            Notify.create({
                message: `Extracción de archivo exitosa, espere mientras se procesa la información.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: 'blue',
                multiLine: true
            });
            textResponse.value = response.data.response;
            responseIADialog.value = true;
            formatData(response.data.response);
        } else {
            throw new Error('Error al extraer el archivo.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al extraer el archivo.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}

async function formatData(text) {
    try {
        const response = await formatDataRequirement({ text, normId: norm.value.value });
        console.log(response);
        if (response.status <= 300) {
            // Mostrar notificación de éxito
            Notify.create({
                message: `Operación exitosa.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: 'blue',
                multiLine: true
            });

            //agregar id a cada requisito y agregar un input por requisito donde se pueda agregar la descripción
            response.data.response.requirements.forEach((r, i) => {
                r._id = i + 1;
                r.inputs = [{ _id: 1, description: r.description, value: null }];
            });

            dataFormat.value = response.data.response;
        } else {
            throw new Error('Error al formatear la información.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al formatear la información.',
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
    expandedRows.value = requis.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}

function closeResponse() {
    responseIADialog.value = false;
    formatDialog.value = true;
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

.tablereq {
    width: 100%;
    border-collapse: collapse;
}

.tablereq th,
.tablereq td {
    border: 1px solid #ddd;
    padding: 8px;
}

.tablereq th {
    background-color: #f2f2f2;
    text-align: left;
}

/* Limitar el tamaño máximo de cada columna */
.col-number {
    max-width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-title {
    max-width: 40px;
    overflow: hidden;
    text-align: center;
}

.col-requirements {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-number {
    max-width: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-req-title {
    max-width: 60px;
    overflow: hidden;
    white-space: wrap;
}

.col-req-description {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-value {
    max-width: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
.col-actions {
    max-width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
</style>
