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
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 30vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">EVALUAR REQUISITO</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md justify-center flex">
                                <div class="col-6">
                                    <q-select v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" @update:model-value="getRequirements()" />
                                </div>

                                <div class="col-6">
                                    <q-select
                                        :disabled="!norm"
                                        v-model="requirement"
                                        :options="requirements"
                                        label="Requisito"
                                        required
                                        style="padding: 10px"
                                        lazy-rules
                                        :rules="[(val) => val || 'Requerimiento']"
                                        @update:model-value="listRequirements()"
                                    />
                                </div>

                                <div class="col-10 q-mt-md">
                                    <q-list bordered padding>
                                        <q-item-label header>Descripción de los Requisitos</q-item-label>

                                        <q-item tag="label" v-ripple>
                                            <q-item-section side top> Selección </q-item-section>

                                            <q-item-section top class="text-center"> Descripción </q-item-section>

                                            <q-item-section side top> Evidencias sugerencias </q-item-section>
                                        </q-item>
                                        <q-item tag="label" v-ripple v-for="input in inputs" :key="input._id">
                                            <q-item-section side top>
                                                <q-checkbox v-model="input.selected" />
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label> {{ input.description }} </q-item-label>
                                            </q-item-section>

                                            <q-item-section side class="text-lg">
                                                <q-item-label> Cartas, cursos, ceritificaciones </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <!-- <q-item tag="label" v-ripple>
                                            <q-item-section side top>
                                                <q-checkbox v-model="check1" />
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label > Notify me about updates to apps or games that I downloaded </q-item-label>
                                            </q-item-section>

                                            <q-item-section side class="text-lg">
                                                <q-item-label > Cartas, cursos, ceritificaciones </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item tag="label" v-ripple>
                                            <q-item-section side top>
                                                <q-checkbox v-model="check2" />
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label > Auto-update apps at anytime. Data charges may apply </q-item-label>
                                            </q-item-section>
                                        </q-item>

                                        <q-item tag="label" v-ripple>
                                            <q-item-section side top>
                                                <q-checkbox v-model="check3" />
                                            </q-item-section>

                                            <q-item-section>
                                                <q-item-label>Auto-add widgets</q-item-label>
                                                <q-item-label > Automatically add home screen widgets </q-item-label>
                                            </q-item-section>
                                        </q-item> -->
                                    </q-list>
                                </div>

                                <!-- Nueva sección de preguntas -->
                                <div class="col-12 q-mt-md">
                                    <div class="row">
                                        <!-- Primera columna con 3 filas -->
                                        <div class="col-4">
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta 1 se cumple?</p>
                                                <q-checkbox v-model="pregunta1" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ pregunta1 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta 2 se cumple?</p>
                                                <q-checkbox v-model="pregunta2" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ pregunta2 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta 3 se cumple?</p>
                                                <q-checkbox v-model="pregunta3" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ pregunta3 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                        </div>
                                        <!-- Segunda columna con 3 filas -->
                                        <div class="col-4">
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta central 1 se cumple?</p>
                                                <q-checkbox v-model="preguntaCentral1" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ preguntaCentral1 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta central 2 se cumple?</p>
                                                <q-checkbox v-model="preguntaCentral2" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ preguntaCentral2 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta central 3 se cumple?</p>
                                                <q-checkbox v-model="preguntaCentral3" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ preguntaCentral3 ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                        </div>
                                        <!-- Tercera columna centrada que ocupa el espacio equivalente a 3 filas -->
                                        <div class="col-4 flex flex-center">
                                            <div class="q-pa-sm">
                                                <p>¿La pregunta única se cumple?</p>
                                                <q-checkbox v-model="preguntaSolita" true-label="Cumple" false-label="No cumple" />
                                                <span>{{ preguntaSolita ? 'Cumple' : 'No cumple' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- <div class="col-12 justify-center flex text-xl q-mt-md">
                                    <div class="text-center flex text-bold">Seleccione los requisitos a evaluar:</div>
                                    <table class="tablereq q-mt-md">
                                        <thead>
                                            <tr>
                                                <th class="col-number">Número</th>
                                                <th class="col-title">Título</th>
                                                <th class="col-requirements" colspan="3">Requisitos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="col-number text-lg">{{ dataFormat.number }}</td>
                                                <td class="col-title text-lg">
                                                    {{ dataFormat.title }}
                                                </td>
                                                <td class="col-requirements" colspan="3">
                                                    <table class="tablereq">
                                                        <thead>
                                                            <tr>
                                                                <th class="col-req-number">Número de Requisito</th>
                                                                <th class="col-req-title">Título de Requisito</th>
                                                                <th class="col-req-description">Descripción de Requisito</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="req in dataFormat.requirements" :key="req.number" class="cursor-pointer">
                                                                <td class="col-req-number text-lg">
                                                                    {{req.number}}
                                                                </td>
                                                                <td class="col-req-title text-lg">
                                                                    {{req.title}}
                                                                </td>
                                                                <td class="col-req-description text-lg">
                                                                    <template v-for="input in req.inputs" :key="input._id">
                                                                        <span 
                                                             
                                                                        class=" text-lg">
                                                                        {{input.description}}</span>
                                      
                                                                    </template>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> -->
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
import { getNormEnterpriseApi } from '@/api/norms';
import { getQualificationsApi, processRequirementsApi } from '@/api/qualifications';
import { notifyError, notifySuccess } from '@/config/notifications';
import { storeAuth } from '@/store/auth';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const qualifications = ref([]);
const qualificationDialog = ref(true);
const file = ref(null);
const norm = ref(null);
const norms = ref([null]);
const requirement = ref(null);
const requirements = ref([]);
const inputs = ref([]);
const expandedRows = ref([]);
//Declarar las variables reactias para cada chekbox
const pregunta1 = ref(false);
const pregunta2 = ref(false);
const pregunta3 = ref(false);
const preguntaCentral1 = ref(false);
const preguntaCentral2 = ref(false);
const preguntaCentral3 = ref(false);
const preguntaSolita = ref(false);

let dataFormat = ref({
    number: '4',
    requirements: [
        {
            _id: 1,
            description:
                '"La organización debe cumplir la legislación vigente que le sea aplicable atendiendo los requisitos nacionales y particularidades regionales o locales en las dimensiones de la sostenibilidad (ambiental, social y económico), entre las que se encuentran las siguientes: - la operación del establecimiento - los planes de ordenamiento territorial - la accesibilidad de instalaciones; - la protección de datos personales; - la prevención de la explotación sexual comercial de niños, niñas y adolescentes (ESCNNA) y de la trata de personas. - las zonas de carga y descarga; - uso de recursos naturales - disposición de Residuos y Vertimientos Si se realiza alguna otra actividad que requiera una licencia o autorización adicional a la de la actividad habitual del establecimiento, ésta debe estar en posesión del establecimiento. "',
            number: '4.1',
            title: 'Cumplimiento de la legislación',
            inputs: [
                {
                    _id: 1,
                    description:
                        'La organización debe cumplir la legislación vigente que le sea aplicable atendiendo los requisitos nacionales y particularidades regionales o locales en las dimensiones de la sostenibilidad (ambiental, social y económico), entre las que se encuentran las siguientes: - la operación del establecimiento - los planes de ordenamiento territorial - la accesibilidad de instalaciones; - la protección de datos personales; - la prevención de la explotación sexual comercial de niños, niñas y adolescentes (ESCNNA) y de la trata de personas. - las zonas de carga y descarga; - uso de recursos naturales - disposición de Residuos y Vertimientos Si se realiza alguna otra actividad que requiera una licencia o autorización adicional a la de la actividad habitual del establecimiento, ésta debe estar en posesión del establecimiento.'
                }
            ]
        },
        {
            _id: 2,
            description:
                'La organización debe determinar:\n- las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1;\n- los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).\nLa organización debe establecer, implementar y mantener un procedimiento para la identificación y compromiso de las partes interesadas en las cuestiones de desarrollo sostenible identificados y emergentes relacionados con su rol en la cadena de valor de los eventos. La organización debe documentar los resultados de su compromiso con las partes interesadas.\nLa identificación de las partes interesadas debe abarcar, cuando proceda, lo siguiente:\na) el organizador de evento;\nb) el propietario del evento;\nc) la fuerza laboral;\nd) la cadena de suministro;\ne) los participantes;\nf) los asistentes;\ng) los organismos reguladores;\nh) la comunidad.\ni) organizaciones no gubernamentales que velen por el ambiente, la cultura y el patrimonio',
            number: '4.2',
            title: 'Comprensión de la organización y de su contexto ',
            inputs: [
                {
                    _id: 1,
                    description:
                        'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica, y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la sostenibilidad. La organización debe realizar el seguimiento y la revisión de la información sobre estas cuestiones externas e internas. '
                }
            ]
        },
        {
            _id: 3,
            description:
                'La organización debe determinar: Las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1; Los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).',
            number: '4.3',
            title: 'Comprensión de las necesidades y expectativas de las partes interesadas',
            inputs: [
                { _id: 1, description: 'La organización debe determinar: Las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1;' },
                { _id: 2, description: 'Los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).' }
            ]
        },
        {
            _id: 4,
            description:
                'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la sostenibilidad de eventos a fin de establecer su alcance. Al determinar este alcance, la organización debe considerar: - las cuestiones externas e internos mencionados en el numeral 4.1; y - los requisitos a los que se hace referencia en el numeral 4.2. - los tipos de actividades, procesos, productos y servicios proporcionados por la organización.El alcance debe estar disponible como información documentada.',
            number: '4.4',
            title: 'Determinación del alcance del sistema de gestión de la sostenibilidad de eventos',
            inputs: [
                {
                    _id: 1,
                    description:
                        'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la sostenibilidad de eventos a fin de establecer su alcance. Al determinar este alcance, la organización debe considerar: - las cuestiones externas e internos mencionados en el numeral 4.1; y - los requisitos a los que se hace referencia en el numeral 4.2. - los tipos de actividades, procesos, productos y servicios proporcionados por la organización.El alcance debe estar disponible como información documentada.'
                }
            ]
        },
        {
            _id: 5,
            description:
                'La organización debe establecer, implementar, mantener y mejorar continuamente un sistema de gestión de la sostenibilidad, incluidos los procesos necesarios y sus interacciones, de acuerdo con los requisitos del presente documento. La organización debe determinar los procesos necesarios para el sistema de gestión de la sostenibilidad y su aplicación a través de la organización, y debe: ',
            number: '4.5.1',
            title: 'Sistema de gestión de la sostenibilidad',
            inputs: [
                { _id: 1, description: 'a. Determinar las entradas requeridas y las salidas esperadas de estos procesos;' },
                { _id: 2, description: 'b. Determinar la secuencia e interacción de estos procesos' },
                {
                    _id: 3,
                    description:
                        'c. Determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, las mediciones y los indicadores del desempeño relacionados) necesarios para asegurarse de la operación eficaz y el control de estos procesos;'
                },
                { _id: 4, description: 'd. Determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad; ' },
                { _id: 5, description: 'h. Asignar las responsabilidades y autoridades para estos procesos' },
                { _id: 6, description: 'i. Abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del numeral 6.1;' },
                { _id: 7, description: 'j. Evaluar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos:' },
                { _id: 8, description: 'k. Mejorar los procesos y el sistema de gestión de la sostenibilidad' }
            ]
        },
        {
            _id: 6,
            description: 'En la medida en que sea necesario, la organización debe:',
            number: '4.5.2',
            title: 'En la medida en que sea necesario, la organización debe: ',
            inputs: [
                { _id: 1, description: 'a. Mantener información documentada para apoyar la operación de sus proceso' },
                { _id: 2, description: 'b. Conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado. ' }
            ]
        }
    ],
    title: 'CONTEXTO DE LA ORGANIZACIÓN'
});

const normId = ref('');
const response = ref(null);

const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const useStoreAuth = storeAuth();
const enterprise = ref();

onBeforeMount(async () => {
    enterprise.value = useStoreAuth.getSelectedCompany();
    await getQualifications();
    await getNorms();
});

async function getRequirements() {
    // try {
    //     const { data } = await getRequirementsByNormApi(norm.value.value);
    //     console.log('Requerimientos:', data);
    // } catch (error) {
    //     console.error(error);
    // }

    requirements.value = dataFormat.value.requirements.map((r) => ({ label: r.title, value: r._id }));
}

async function listRequirements() {
    //buscar el requerimiento seleccionado

    const req = dataFormat.value.requirements.find((r) => r._id == requirement.value.value);
    inputs.value = req.inputs.map((r) => ({ _id: r._id, description: r.description, selected: false }));
}

async function getQualifications() {
    try {
        const { data } = await getQualificationsApi();
        qualifications.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error al obtener datos de qualifications:', error);
        qualifications.value = []; // Asigna un array vacío para evitar futuros errores
    }
}

async function getNorms() {
    try {
        const { data } = await getNormEnterpriseApi(enterprise.value.value);
        norms.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];
        norm.value = norms.value[0];
        await getRequirements();
    } catch (error) {
        console.error(error);
    }
}

const selectFile = (event) => {
    file.value = event.target.files[0];
    uploadFileServer();
};

function openDialog() {
    norm.value = null;
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
