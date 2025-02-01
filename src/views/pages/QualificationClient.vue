<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Requerimientos</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" /> -->

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" /> -->

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <!-- <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" /> -->
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
                :rowsPerPageOptions="[5, 10, 25, 50, 100]"
            >
                <!-- <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" /> -->
                <Column field="indicator" header="INDICADOR" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ slotProps.data?.indicator }}
                    </template>
                </Column>
                <Column field="requirement" header="REQUISITO" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ slotProps.data?.description }}
                    </template>
                </Column>
                <Column field="norm" header="NORMA " :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        {{ slotProps.data?.norm?.name }}
                    </template>
                </Column>
                <Column field="qualificaction" header="EVALUACIÓN" :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        {{ calculateQualification(slotProps.data) }}
                    </template>
                </Column>
                <Column field="evidence" header="EVIDENCIAS" :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        <q-btn
                            icon="visibility"
                            :style="{
                                backgroundColor: slotProps.data.evidence ? 'rgb(4, 178, 217)' : 'rgb(242, 185, 179)',
                                color: 'white'
                            }"
                            @click="viewFiles(slotProps.data.evidence)"
                            dense
                            round
                            class="q-mr-md"
                        />
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="evaluateQualification(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <p><strong>Description:</strong>{{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data?.norm?.name }}</p>
                        <p><strong>Calificación:</strong> {{ slotProps.data?.evaluation }}</p>
                        <p><strong>Evidencia:</strong>{{ slotProps.data?.evidence }}</p>
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
                                <div class="col-4">
                                    <q-select disable v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" @update:model-value="getRequirements()" />
                                </div>

                                <div class="col-5">
                                    <q-select
                                        disable
                                        :disable="!norm"
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

                                <div class="col-3">
                                    <q-select v-model="year" :options="yearOptions" label="Año Evaluado" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Año requerido']" />
                                </div>

                                <div class="col-10 q-mt-md" style="overflow-y: auto; max-height: 400px">
                                    <table class="tablereq">
                                        <thead>
                                            <tr>
                                                <th>Selección</th>
                                                <th>Descripción</th>
                                                <th>Evidencias sugeridas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="input in inputs" :key="input._id">
                                                <td class="col-value">
                                                    <q-checkbox disable v-model="input.selected" />
                                                </td>
                                                <td class="col-req-description">
                                                    {{ input.description }}
                                                </td>
                                                <td class="col-req-description">
                                                    <q-item-label v-html="renderSuggested(input.suggestedEvidence)"> </q-item-label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="col-12 justify-center flex q-py-lg">
                                    <template v-for="file in files">
                                        <div class="col-12 justify-center flex items-center">
                                            <q-chip removable @remove="files.splice(files.indexOf(file), 1)">
                                                <q-icon name="attachment" />
                                                <q-chip-main>
                                                    {{ file?.name }}
                                                </q-chip-main>
                                            </q-chip>
                                        </div>
                                    </template>
                                    <template v-if="!files.length"> No se ha seleccionado un archivo </template>
                                </div>
                                <div class="col-12 justify-center flex items-center">
                                    <input multiple type="file" id="inputFile" @change="selectFile" style="display: none" accept=".pdf,.txt,.jpg,.jpeg,.png" />
                                    <q-btn :disable="!norm || !requirement || !inputs.length" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog" />
                            <q-btn class="q-mx-sm" outline label="EVALUAR" color="primary" @click="uploadFileServer()" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
    <q-dialog v-model="viewDocument" persistent>
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 30vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-card-section>
                        <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">EVIDENCIAS CARGADAS</div>
                    </q-card-section>
                    <q-card-section v-for="evidence in evidencesView" class="row justify-center flex q-gutter-x-md q-gutter-y-md">
                        <div class="col-10">
                            Fecha de carga: {{ evidence.date }}
                            <hr />
                        </div>

                        <div class="col-10 col-sm-5 col-md-3" v-for="file in evidence.evidences">
                            <q-card class="my-card bg-grey-11" flat bordered>
                                <div class="q-pa-sm text-center bg-grey-1">
                                    <div>{{ file.originalname }}</div>
                                </div>
                                <div class="justify-center flex">
                                    <q-icon :name="'description'" size="10rem" class="text-primary" />
                                </div>
                                <div class="justify-center flex q-py-sm">
                                    <q-btn
                                        icon="visibility"
                                        :style="{
                                            backgroundColor: 'rgb(4, 178, 217)',
                                            color: 'white'
                                        }"
                                        @click="renderFile(file?.name)"
                                        dense
                                        round
                                        class="q-mr-md"
                                    />
                                    <q-btn
                                        icon="cloud_download"
                                        :style="{
                                            backgroundColor: 'rgb(4, 178, 217)',
                                            color: 'white'
                                        }"
                                        @click="downloadFile(file?.name)"
                                        dense
                                        round
                                    />
                                </div>
                            </q-card>
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div class="col-12 justify-center flex q-py-xs">
                            <q-btn class="q-mx-sm" outline label="Cerrar" color="negative" @click="viewDocument = false" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { getFileApi } from '@/api/files';
import { getNormEnterpriseApi } from '@/api/norms';
import { getQualificationsApi, processRequirementsApi } from '@/api/qualifications';
import { getRequirementsByNormAndEnterpriseApi } from '@/api/requirements';
import { notifyError, notifySuccess } from '@/config/notifications';
import { storeAuth } from '@/store/auth';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const qualifications = ref([]);
const qualificationDialog = ref(false);
const viewDocument = ref(false);
const evidencesView = ref([]);
const files = ref([]);
const norm = ref(null);
const norms = ref([null]);
const reqData = ref([]);
const requirement = ref(null);
const requirements = ref([]);
const inputs = ref([]);
const expandedRows = ref([]);
const year = ref(new Date().getFullYear());
//crear array de años desde 2020 hasta el año actual
const yearOptions = ref(Array.from({ length: new Date().getFullYear() - 2022 }, (_, i) => 2023 + i).reverse());
//Declarar las variables reactias para cada chekbox

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

const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const useStoreAuth = storeAuth();
const enterprise = ref();

const renderSuggested = (suggested) => {
    console.log(suggested);

    //bucar todos los \n y reemplazarlos por <br>

    if (suggested) {
        return suggested.replace(/\n/g, '<br><br>');
    } else {
        return 'No hay evidencia sugerida';
    }
};

onBeforeMount(async () => {
    enterprise.value = useStoreAuth.getSelectedCompany();
    await getQualifications();
    await getNorms();
});

async function getRequirements() {
    try {
        const { data } = await getRequirementsByNormAndEnterpriseApi(norm.value.value, enterprise.value.value);

        //extraer los requirements de cada recurso y dejarlos en un array
        reqData.value = data.map((r) => r.requirements).flat();

        requirements.value = reqData.value.map((r) => ({ label: r.title, value: r._id }));
    } catch (error) {
        console.error(error);
    }
}

async function listRequirements() {
    //buscar el requerimiento seleccionado
    const req = reqData.value.find((r) => r._id == requirement.value.value);
    inputs.value = req.inputs.map((r) => ({ _id: r._id, description: r.description, selected: false }));
}

async function getQualifications() {
    try {
        const { data } = await getQualificationsApi(enterprise.value.value);
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
    for (let i = 0; i < event.target.files.length; i++) {
        if (!['application/pdf', 'text/plain', 'image/jpeg', 'image/png', 'image/jpg'].includes(event.target.files[i].type)) {
            notifyError({ message: 'Uno de los archivos seleccionados no tiene un formato válido.' });
            return;
        }

        files.value.push(event.target.files[i]);
    }
};

function openDialog() {
    files.value = [];
    inputs.value = [];
    norm.value = null;
    requirement.value = null;
    norm.value = null;
    qualificationDialog.value = true;
}

function evaluateQualification(data) {
    console.log(data);
    files.value = [];

    norm.value = norms.value.find((n) => n.value == data.norm._id);
    let requeriment = [];
    reqData.value.forEach((r) => {
        //buscar el input que tenga el r.id
        r.inputs.forEach((i) => {
            if (data.id == i._id) {
                requeriment.push(r);
            }
        });
    });

    requirement.value = { label: requeriment[0].title, value: requeriment[0]._id };

    //validar si suggestedEvidence es un array

    inputs.value = [
        {
            _id: data.id,
            description: requeriment[0].inputs.find((i) => i._id == data.id).description,
            indicator: data.indicator,
            selected: true
        }
    ];
    if (Array.isArray(data.suggestedEvidence)) {
        inputs.value[0].suggestedEvidence = data.suggestedEvidence[0];
    } else {
        inputs.value[0].suggestedEvidence = data.suggestedEvidence;
    }
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
        if (!files.value) {
            notifyError({ message: 'Debe seleccionar un archivo.' });
            return;
        }

        const formData = new FormData();
        files.value.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('normId', norm.value.value);
        formData.append('enterpriseId', enterprise.value.value);
        formData.append('requirementId', requirement.value.value);
        formData.append('inputs', JSON.stringify(inputs.value.filter((i) => i.selected).map((i) => i._id)));
        formData.append('year', year.value);

        const response = await processRequirementsApi(formData);

        if (response.status <= 300) {
            console.log(response.data.errors);
            /* 
            [ 'La evidencia para el requisito 1.1.1 no es válida' 
            */

            if (response?.data?.errors?.length > 0) {
                response.data.errors.forEach((error) => {
                    notifyError({ message: error });
                });
            } else {
                Notify.create({ message: 'Norma evaluada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            }

            if(response.data?.finished){
                notifySuccess({ message: 'Tú diagnóstico está listo para ser revisado.', color: 'green' });
            }

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

function calculateQualification(data) {
    if (data?.required) {
        if (data?.cumple != 0) {
            return data?.cumple;
        } else {
            return data?.noCumple;
        }
    } else {
        if (data?.justifica != 0) {
            return data?.justifica;
        } else {
            return data?.noJustifica;
        }
    }
}

async function renderFile(nameFile) {
    if (!nameFile) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    const response = await getFileApi(nameFile);

    if (response.status <= 300) {
        const documentUrl = URL.createObjectURL(response.data);

        //abrir otra ventana con el archivo
        window.open(documentUrl, '_blank');
    } else {
        notifyError({ message: 'Error al obtener el archivo.' });
    }
}

async function viewFiles(evidences) {
    evidencesView.value = [];
    //agrupar las evidencias por día
    const data = evidences.reduce((acc, evidence) => {
        const date = new Date(evidence.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(evidence);
        return acc;
    }, {});

    for (const key in data) {
        evidencesView.value.push({
            date: key,
            evidences: data[key]
        });
    }

    viewDocument.value = true;
}

async function downloadFile(nameFile) {
    if (!nameFile) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    const response = await getFileApi(nameFile);

    if (response.status <= 300) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nameFile);
        document.body.appendChild(link);
        link.click();
    } else {
        notifyError({ message: 'Error al obtener el archivo.' });
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
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
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
