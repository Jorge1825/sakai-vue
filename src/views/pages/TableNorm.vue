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
                <Column field="number" header="NUMBERO" :sortable="true" style="width: 5%" />
                <Column field="norm" header="NORMA" style="width: 15%">
                    <template #body="slotNorms">
                        {{ slotNorms.data?.norm?.name }}
                    </template>
                </Column>
                <Column field="title" header="TITULO" style="width: 80%" />
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

                        <q-card-section class="overflow-auto">
                            <table class="tablereq overflow-auto">
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
                                                        <th class="col-renovation">Renovación</th>
                                                        <th class="col-evidence">Evidencia</th>
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
                                                            <template v-for="(input,index) in req.inputs" :key="input._id">
                                                                <span class="hidden">  
                                                                    {{ input.indicator = req.number + '.' + (index + 1) }}

                                                                </span>
                                                                <q-input v-model="input.description" dense autogrow
                                                                :hint="input.indicator" 
                                                                >
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
                                                        <td class="col-renovation">
                                                            <template v-for="input in req.inputs" :key="input._id">
                                                                <q-select v-model="input.renovation" :options="renovationOptions" dense />
                                                            </template>
                                                        </td>
                                                        <td class="col-evidence">
                                                            <template v-for="input in req.inputs" :key="input._id">
                                                                <q-input v-model="input.suggestedEvidence" dense autogrow />
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
                                <tfoot>
                                    <tr>
                                        <td colspan="5">
                                            <div class="row">
                                                <div class="col-5 text-bold text-xl text-end">Total:</div>
                                                <div class="col-5 text-xl q-mx-md">
                                                    {{ calculateTotal() }}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </q-card-section>
                        <q-card-section>
                            <div class="row full-width">
                                <div class="col-12">Nota: Para una correcta generación de evidencias por favor ubicar adecuadamente los requisitos primero y luego solitar las evidencias por IA</div>
                                <div class="col-2 justify-center flex items-center q-py-lg text-lg">Generar evidencias por IA:</div>
                                <div class="col-3 justify-start flex items-center q-py-lg q-px-md">
                                    <!-- <input type="file" id="inputFileEvidence" @change="selectFileEvidence" style="display: none" accept=".pdf" /> -->
                                    <q-btn label="Generar Evidencias" color="primary" @click="selectFileEvidence" />
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
]);
const suggestedEvidences = ref([]);
let file = ref(null);
let fileEvidence = ref(null);
let textResponse = ref('');
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
    // formData.append('file', fileEvidence.value);
    formData.append('inputs', JSON.stringify(inputsReq));

    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await generateEvidencesApi(formData);

/* 
 {
    data: {
      message: 'Evidencias generadas exitosamente',
      response: Array(11) [
        {
          evidence: [
            'Acta de nombramiento del responsable del SG-SST', 
              'Copia del certificado de aprobación del curso de 50 horas en SST del responsable del SG-SST',
            
              'Descripción del perfil profesional del responsable del SG-SST incluyendo experiencia y formación'
          ],
          id: '6755cc2421306b1a0f73c055',
          title: 
            'Responsable del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST'
        },
        {
          evidence: [
            'Matriz de responsabilidades del SG-SST', 
              'Descripción de las funciones y tareas de cada miembro del equipo del SG-SST',
            'Manual de procedimientos del SG-SST'
          ],
          id: '6755cc2421306b1a0f73c056',
          title: 
            'Responsabilidades en el Sistema de Gestión de Seguridad y Salud en el Trabajo – SG-SST'
        },

*/
        //asignar las evidencias a cada input
        dataFormat.value.requirements.forEach((r) => {
            r.inputs.forEach((i) => {
                const evidence = response.data.response.find((e) => e.id == i._id);
                i.suggestedEvidence = evidence?.evidence.join('\n');
            });
        });


        // Mostrar notificación de éxito
        Notify.create({
            message: `Generación de evidencias exitosa, espere mientras se procesa la información.`,
            type: 'positive',
            position: 'top',
            textColor: 'white',
            color: 'blue',
            multiLine: true
        });
    } catch (error) {
        fileEvidence.value = null;
        console.error(error);
        Notify.create({
            message: 'Hubo un error al extraer el archivo.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'rgb(242, 185, 179)',
            multiLine: true
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
            norm: norm.value.value
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

        const response = await createRequirementApi({ norm: norm.value.value, ...dataFormat.value });
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
            color: 'rgb(242, 185, 179)',
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

            //hacer la descripcion un array separando su contenido por cada \n
            response.data.response.requirements.forEach((r) => {
                r._id = i + 1;
                r.inputs = r.description.split('\n').map((d, i) => ({ _id: i + 1, description: d, value: null }));
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
            color: 'rgb(242, 185, 179)',
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
    width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-title {
    width: 150px;
    overflow: hidden;
    text-align: center;
}

.col-requirements {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-number {
    max-width: 50px;
    min-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-req-title {
    max-width: 150px;
    min-width: 150px;
    overflow: hidden;
    white-space: wrap;
}

.col-req-description {
    max-width: 150px;
    min-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-value {
    width: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-renovation {
    width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-evidence {
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-actions {
    width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
</style>
