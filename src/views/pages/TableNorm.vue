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
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />
                    <!-- Botón de colapsar -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" />
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
                <Column field="name" header="NUMBER" :sortable="true" style="width: 5%" />
                <Column field="description" header="TITULO" style="width: 20%" />
                <Column field="requirements" header="REQUISITOS" style="width: 60%">
                    <template #body="slotNorms">
                        {{ slotNorms.data.requirements }}
                    </template>
                </Column>
                <!-- Columna de calificaciones (para números) -->
                <!-- <Column field="score" header="CALIFICACIONES" style="width: 5%">
          <template #body="slotNorms">
            <q-input v-model="slotNorms.data.score" type="number" dense />
          </template>
        </Column> -->
                <!-- Columna para el botón "ojo" en cada fila -->
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotNorms">
                        <q-btn icon="visibility" :style="{ color: 'rgb(4, 178, 217)' }" @click="botonMostrarDelOjo(slotNorms.data)" dense round />
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
                                {{ requi._id ? 'EDITAR REQUERIMIENTO' : 'NUEVA REQUERIMIENTO' }}
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
                                {{ requi._id ? 'EDITAR NORMA' : 'NUEVA NORMA' }}
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
                                        <td class="col-title">{{ dataFormat.title }}</td>
                                        <td class="col-requirements" colspan="3">
                                            <table class="tablereq">
                                                <thead>
                                                    <tr>
                                                        <th class="col-req-number">Número de Requisito</th>
                                                        <th class="col-req-title">Título de Requisito</th>
                                                        <th class="col-req-description">Descripción de Requisito</th>
                                                        <th class="col-actions">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="req in dataFormat.requirements" :key="req.number">
                                                        <td class="col-req-number">{{ req.number }}</td>
                                                        <td class="col-req-title">{{ req.title }}</td>
                                                        <td class="col-req-description">
                                                            <template v-for="input in req.inputs" :key="input.id">
                                                                <q-input v-model="input.description" dense autogrow>
                                                                    <template v-slot:append>
                                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInput(req.id, input.id)" />
                                                                    </template>
                                                                </q-input>
                                                            </template>
                                                        </td>
                                                        <td class="col-actions">
                                                            <q-btn icon="control_point_duplicate" :style="{ color: 'rgb(4, 178, 217)' }" @click="addInput(req.id)" dense round />
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
import { formatDataRequirement, generateRequirementFile } from '@/api/requirements';
import { createRoleApi, editRoleApi, getRolesApi, toggleActiveRoleApi } from '@/api/roles.js';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const requis = ref([
    // Datos de ejemplo
    { _id: 1, name: '001/6503', description: 'Norma de seguridad', requirements: 'La requia de seguridad dicta que.....', score: 0 },
    { _id: 2, name: '002/6504', description: 'Norma de calidad', requirements: 'La requia de calidad dicta que.....', score: 0 },
    { _id: 3, name: '003/6505', description: 'Norma de ambiente', requirements: 'La requia de ambeinte dicta que.....', score: 0 }
]);

const requiDialog = ref(false);
const responseIADialog = ref(true);
const formatDialog = ref(false);
const norm = ref(null);
const norms = ref([]);
const requi = ref({
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
let file = ref(null);
let textResponse = ref('');
let dataFormat = ref({
    number: '4',
    requirements: [
        {
            id: 1,
            description:
                'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la sostenibilidad de eventos.\nNOTA 1 El término "cuestión" en este subnumeral es sinónimo de "contexto" según se define en el numeral 3.42.\nNOTA 2 La organización es la que se describe en los numerales 4.3 y 4.4.',
            number: '4.1',
            title: 'Comprensión de la organización y de su contexto',
            inputs: [{ id: 1, description: 'Requisito 1' }]
        },
        {
            id: 2,
            description:
                'La organización debe determinar:\n- las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1;\n- los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).\nLa organización debe establecer, implementar y mantener un procedimiento para la identificación y compromiso de las partes interesadas en las cuestiones de desarrollo sostenible identificados y emergentes relacionados con su rol en la cadena de valor de los eventos. La organización debe documentar los resultados de su compromiso con las partes interesadas.\nLa identificación de las partes interesadas debe abarcar, cuando proceda, lo siguiente:\na) el organizador de evento;\nb) el propietario del evento;\nc) la fuerza laboral;\nd) la cadena de suministro;\ne) los participantes;\nf) los asistentes;\ng) los organismos reguladores;\nh) la comunidad.\ni) organizaciones no gubernamentales que velen por el ambiente, la cultura y el patrimonio',
            number: '4.2',
            title: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            inputs: [
                { id: 1, description: 'Requisito 1' },
                { id: 2, description: 'Requisito 2' },
                { id: 3, description: 'Requisito 3' }
            ]
        },
        {
            id: 3,
            description:
                'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la sostenibilidad de eventos a fin de establecer su alcance.\nAl determinar este alcance, la organización debe considerar:\n- las cuestiones externas e internos mencionados en el numeral 4.1; y\n- los requisitos a los que se hace referencia en el numeral 4.2.\nEl alcance debe estar disponible como información documentada.',
            number: '4.3',
            title: 'Determinación del alcance del sistema de gestión de la sostenibilidad de eventos',
            inputs: [
                { id: 1, description: 'Requisito 1' },
                { id: 2, description: 'Requisito 2' }
            ]
        },
        {
            id: 4,
            description:
                'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de sostenibilidad para eventos, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos de la presente Norma.',
            number: '4.4',
            title: 'Sistema de gestión de la sostenibilidad de eventos',
            inputs: [
                { id: 1, description: 'Requisito 1' },
                { id: 2, description: 'Requisito 2' }
            ]
        },
        {
            id: 5,
            description:
                'La organización debe definir sus principios rectores del desarrollo sostenible en forma de una declaración de propósitos y valores. Los principios rectores del desarrollo sostenible de la organización en relación con la gestión de eventos deben incluir, como mínimo, consideraciones de compromiso, inclusión, integridad y transparencia. La organización debe definir y documentar su propósito principal y sus valores con respecto a sus actividades, productos y servicios relacionados específicamente con los eventos.\nLos principios, el propósito y los valores de la organización deben proporcionar un marco para establecer sus políticas, objetivos y metas, tal como se definen en el alcance de su sistema de gestión de la sostenibilidad de eventos.',
            number: '4.5',
            title: 'Principios de desarrollo sostenible, declaración de propósitos y valores',
            inputs: [
                { id: 1, description: 'Requisito 1' },
                { id: 2, description: 'Requisito 2' }
            ]
        }
    ],
    title: 'CONTEXTO DE LA ORGANIZACIÓN'
});

onBeforeMount(async () => {
    await getRoles();
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

async function getRoles() {
    try {
        const { data } = await getRolesApi();
        requis.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}
async function getNorms() {
    try {
        const { data } = await getNormsApi();
        norms.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    requi.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        status: status.value[0]
    };
    requiDialog.value = true;
}

function hideDialog() {
    requiDialog.value = false;
}

async function saveNorm() {
    console.log(requi.value);

    if (requi.value._id) {
        const requiApi = {
            id: requi.value._id,
            name: requi.value.name,
            description: requi.value.description,
            status: requi.value.status.value
        };

        const response = await editRoleApi(requiApi);

        if (response.status === 200) {
            Notify.create({ message: 'Rol actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRoles();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el rol.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const requiApi = {
            name: requi.value.name,
            description: requi.value.description,
            status: requi.value.status.value
        };

        const response = await createRoleApi(requiApi);
        console.log(response);

        if (response.status === 200) {
            Notify.create({ message: 'Rol creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRoles();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el rol.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editRole(selectedRole) {
    requi.value = { ...selectedRole };
    requi.value.status = status.value.find((s) => s.value === selectedRole.status);
    requiDialog.value = true;
    console.log(requi.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedRole) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveRoleApi(selectedRole._id);

        if (response.status === 200) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedRole.status = selectedRole.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Rol ${selectedRole.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedRole.status === 'Activo' ? 'blue' : 'red', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getRoles();
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

        if (response.status === 200) {
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
        if (response.status === 200) {
            // Mostrar notificación de éxito
            Notify.create({
                message: `Operación exitosa.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: 'blue',
                multiLine: true
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
    const req = dataFormat.value.requirements.find((r) => r.id === id);
    req.inputs.push({ id: req.inputs.length + 1, description: '' });
}

function removeInput(reqId, inputId) {
    const req = dataFormat.value.requirements.find((r) => r.id === reqId);
    //no remover el ultimo input
    if (req.inputs.length > 1) {
        const inputToRemove = req.inputs.findIndex((i) => i.id === inputId);
        //mover el contenido del input a remover al input anterior
        req.inputs[inputToRemove - 1].description += req.inputs[inputToRemove].description;
        req.inputs.splice(inputToRemove, 1);
    }
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
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-title {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-requirements {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-number {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-title {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-description {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-actions {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
