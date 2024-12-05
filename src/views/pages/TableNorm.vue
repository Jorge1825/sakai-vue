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
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                        @click="openDialog" class="q-mr-sm" />
                    <!-- Botón de expandir -->
                    <!-- <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" /> -->
                    <!-- Botón de colapsar -->
                    <!-- <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" /> -->
                </div>
            </div>
            <!-- Tabla de requias -->
            <DataTable v-model:expandedRows="expandedRows" :value="requis" dataKey="_id" responsiveLayout="scroll"
                :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]">
                <Column field="number" header="NUMBERO" :sortable="true" style="width: 5%" />
                <Column field="title" header="TITULO" style="width: 90%" />
                <Column field="renovation" header="RENOVACIÓN" style="width: 10%"/>
                <template #body="slotProps">
                <div style="text-align: left">
                    {{ renovationOptions.find((r) => r.value === slotProps.data.renovation).label }}
                </div>
                </template>
                <!-- Columna de calificaciones (para números) -->
                <!-- <Column field="score" header="CALIFICACIONES" style="width: 5%">
          <template #body="slotNorms">
            <q-input v-model="slotNorms.data.score" type="number" dense />
          </template>
        </Column> -->
                <!-- Columna para el botón "ojo" en cada fila -->
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotNorms">
                        <q-btn icon="visibility" :style="{ color: 'rgb(4, 178, 217)' }"
                            @click="editRequirement(slotNorms.data?._id)" dense round />
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
                                    <q-select v-model="norm" :options="norms" label="Norma" required
                                        style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" />
                                </div>
                                <div class="col-12 justify-center flex items-center q-py-lg">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn :disabled="!norm" class="q-mx-sm flex" filled label="Cargar Archivo"
                                        color="primary" @click="uploadFile" />
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
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                RESPUESTA</div>
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
                                {{ dataFormat._id ? `EDITAR REQUISITOS - ${norm?.label}` : `NUEVOS REQUISITOS -
                                ${norm?.label}` }}
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
                                                        <th class="col-renovation">Renovación</th>
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
                                                                        <q-btn round dense flat icon="minimize"
                                                                            color="red"
                                                                            @click="removeInput(req._id, input._id)" />
                                                                    </template>
                                                                </q-input>
                                                            </template>
                                                        </td>
                                                        <td class="col-value">
                                                            <template v-for="input in req.inputs" :key="input._id">
                                                                <q-input v-model="input.value" type="number" dense
                                                                    autogrow />
                                                            </template>
                                                        </td>
                                                        <td class="col-renovation">
                                                            <q-select v-model="req.renovation" :options="renovationOptions" dense />
                                                        </td>
                                                        <td class="col-actions">
                                                            <q-btn icon="control_point_duplicate"
                                                                :style="{ color: 'rgb(4, 178, 217)' }"
                                                                @click="addInput(req._id)" dense round />

                                                            <q-btn class="q-mx-sm" icon="add_circle"
                                                                :style="{ color: '#32a600' }" @click="addReq(req._id)"
                                                                dense round />
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
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative"
                                @click="formatDialog = false" />
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
import { getNormApi } from '@/api/norms';
import { createRequirementApi, editRequirementApi, formatDataRequirement, getRequirementsApi } from '@/api/requirements';
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
const renovationOptions = ref([
    { label: 'Anual', value: 1 },
    { label: 'Bienal', value: 2 },
    { label: 'Trienal', value: 3 }
]);
let file = ref(null);
let textResponse = ref('');
let dataFormat = ref({
    number: '4',
    requirements: [
        {
            _id: 1,
            description:
                '"La organización debe cumplir la legislación vigente que le sea aplicable atendiendo los requisitos nacionales y particularidades regionales o locales en las dimensiones de la sostenibilidad (ambiental, social y económico), entre las que se encuentran las siguientes: - la operación del establecimiento - los planes de ordenamiento territorial - la accesibilidad de instalaciones; - la protección de datos personales; - la prevención de la explotación sexual comercial de niños, niñas y adolescentes (ESCNNA) y de la trata de personas. - las zonas de carga y descarga; - uso de recursos naturales - disposición de Residuos y Vertimientos Si se realiza alguna otra actividad que requiera una licencia o autorización adicional a la de la actividad habitual del establecimiento, ésta debe estar en posesión del establecimiento. "',
            number: '4.1',
            title: 'Cumplimiento de la legislación',
            inputs: [{ _id: 1, description: 'La organización debe cumplir la legislación vigente que le sea aplicable atendiendo los requisitos nacionales y particularidades regionales o locales en las dimensiones de la sostenibilidad (ambiental, social y económico), entre las que se encuentran las siguientes: - la operación del establecimiento - los planes de ordenamiento territorial - la accesibilidad de instalaciones; - la protección de datos personales; - la prevención de la explotación sexual comercial de niños, niñas y adolescentes (ESCNNA) y de la trata de personas. - las zonas de carga y descarga; - uso de recursos naturales - disposición de Residuos y Vertimientos Si se realiza alguna otra actividad que requiera una licencia o autorización adicional a la de la actividad habitual del establecimiento, ésta debe estar en posesión del establecimiento.' }]
        },
        {
            _id: 2,
            description:
                'La organización debe determinar:\n- las partes interesadas que son pertinentes al sistema de gestión de la sostenibilidad de eventos, véase Tabla A.1;\n- los requisitos de esas partes interesadas (es decir, sus necesidades y expectativas, ya sean declaradas, implícitas u obligatorias).\nLa organización debe establecer, implementar y mantener un procedimiento para la identificación y compromiso de las partes interesadas en las cuestiones de desarrollo sostenible identificados y emergentes relacionados con su rol en la cadena de valor de los eventos. La organización debe documentar los resultados de su compromiso con las partes interesadas.\nLa identificación de las partes interesadas debe abarcar, cuando proceda, lo siguiente:\na) el organizador de evento;\nb) el propietario del evento;\nc) la fuerza laboral;\nd) la cadena de suministro;\ne) los participantes;\nf) los asistentes;\ng) los organismos reguladores;\nh) la comunidad.\ni) organizaciones no gubernamentales que velen por el ambiente, la cultura y el patrimonio',
            number: '4.2',
            title: 'Comprensión de la organización y de su contexto ',
            inputs: [
                { _id: 1, description: 'La organización debe determinar las cuestiones externas e internas que son pertinentes para su propósito y su dirección estratégica, y que afectan su capacidad para lograr los resultados previstos de su sistema de gestión de la sostenibilidad. La organización debe realizar el seguimiento y la revisión de la información sobre estas cuestiones externas e internas. '},
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
                { _id: 1, description: 'La organización debe determinar los límites y la aplicabilidad del sistema de gestión de la sostenibilidad de eventos a fin de establecer su alcance. Al determinar este alcance, la organización debe considerar: - las cuestiones externas e internos mencionados en el numeral 4.1; y - los requisitos a los que se hace referencia en el numeral 4.2. - los tipos de actividades, procesos, productos y servicios proporcionados por la organización.El alcance debe estar disponible como información documentada.' },
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
                { _id: 3, description: 'c. Determinar y aplicar los criterios y los métodos (incluyendo el seguimiento, las mediciones y los indicadores del desempeño relacionados) necesarios para asegurarse de la operación eficaz y el control de estos procesos;' },
                { _id: 4, description: 'd. Determinar los recursos necesarios para estos procesos y asegurarse de su disponibilidad; ' },
                { _id: 5, description: 'h. Asignar las responsabilidades y autoridades para estos procesos' },
                { _id: 6, description: 'i. Abordar los riesgos y oportunidades determinados de acuerdo con los requisitos del numeral 6.1;' },
                { _id: 7, description: 'j. Evaluar estos procesos e implementar cualquier cambio necesario para asegurarse de que estos procesos logran los resultados previstos:' },
                { _id: 8, description: 'k. Mejorar los procesos y el sistema de gestión de la sostenibilidad' },
            ]
        },
         {
            _id: 6,
            description:
                'En la medida en que sea necesario, la organización debe:',
            number: '4.5.2',
            title: '4.5.2 En la medida en que sea necesario, la organización debe: ',
            inputs: [
                { _id: 1, description: 'a. Mantener información documentada para apoyar la operación de sus proceso' },
                { _id: 2, description: 'b. Conservar la información documentada para tener la confianza de que los procesos se realizan según lo planificado. ' }
            ]
        },
    ],
    title: 'CONTEXTO DE LA ORGANIZACIÓN'
});
let dataFormat_2 = ref({
    number: '5',
    requirements: [
        {
            _id: 1,
            description:
            'La alta dirección debe demostrar su liderazgo y compromiso con respecto al sistema de gestión de la sostenibilidad a través de: ',
            number: '5.1',
            title: 'Liderazgo y compromiso',
            inputs: [
                { _id: 1, description: 'a) asumiendo la responsabilidad y obligación de rendir cuentas con relación a la eficacia del sistema de gestión de la sostenibilidad. ' },
                { _id: 2, description: 'b. asegurar que se establezca la declaración de propósito y valores, así como las políticas y objetivos de sostenibilidad y que sean compatibles con la dirección estratégica de la organización; ' },
                { _id: 3, description: 'c. asegurar la integración de los requisitos del sistema de gestión de la sostenibilidad en los procesos de negocio de la organización;' },
                { _id: 4, description: 'd. promoviendo el uso del enfoque a procesos y el pensamiento basado en riesgos' },
                { _id: 5, description: 'f. asegurar la disponibilidad de los recursos necesarios para el sistema de gestión de la sostenibilidad;' },
                { _id: 6, description: 'g. comunicar la importancia de una gestión eficaz de la sostenibilidad y de cumplir con los requisitos del sistema de gestión de la sostenibilidad; ' },
                { _id: 7, description: 'h. asegurar que el sistema de gestión de la sostenibilidad logre los resultados previstos;  ' },
                { _id: 8, description: 'i. dirigir y apoyar a las personas para que contribuyan a la eficacia del sistema de gestión de la sostenibilidad;  ' },
                { _id: 9, description: 'j. promover la mejora continua ' },
                { _id: 10, description: 'k. apoyar otros roles de gestión pertinentes para demostrar su liderazgo en lo que respecta a sus áreas de responsabilidad. ' },
            ]
        },
        {            _id: 2,
            description:
            'La alta dirección debe establecer una política de desarrollo sostenible que: ',
            number: '5.2.1',
            title: 'Política',
            inputs: [
                { _id: 1, description: '"a) sea apropiada para el propósito de la organización; b) proporcione el marco para establecer los objetivos de sostenibilidad; c) incluya el compromiso de satisfacer los requisitos aplicables; d) incluya el compromiso de mejorar continuamente el sistema de gestión de la sostenibilidad La política de desarrollo sostenible debe: - estar disponible como información documentada; - comunicarse, entenderse y  aplicarse dentro de la organización;- estar disponible para las partes interesadas, según sea apropiado; "' },
                { _id: 2, description: 'b) proporcione el marco para establecer los objetivos de sostenibilidad; c) incluya el compromiso de satisfacer los requisitos aplicables; d) incluya el compromiso de mejorar continuamente el sistema de gestión de la sostenibilidad La política de desarrollo sostenible debe: - estar disponible como información documentada; - comunicarse, entenderse y  aplicarse dentro de la organización;- estar disponible para las partes interesadas, según sea apropiado; "' },
                { _id: 1, description: 'c) incluya el compromiso de satisfacer los requisitos aplicables; d) incluya el compromiso de mejorar continuamente el sistema de gestión de la sostenibilidad La política de desarrollo sostenible debe: - estar disponible como información documentada; - comunicarse, entenderse y  aplicarse dentro de la organización;- estar disponible para las partes interesadas, según sea apropiado; "' }
            ]
        },
        {
            _id: 3,
            description:
            'La alta dirección debe asegurarse de que las responsabilidades y autoridades de los roles pertinentes se asignen y comuniquen dentro de la organización. La alta dirección debe asignar la responsabilidad y autoridad para:  ',
            number: '5.3',
            title: 'La alta dirección debe asegurarse de que las responsabilidades y autoridades de los roles pertinentes se asignen y comuniquen dentro de la organización. La alta dirección debe asignar la responsabilidad y autoridad para:  ',
            inputs: [
                { _id: 1, description: 'a. Asegurar que el sistema de gestión de la sostenibilidad sea conforme con los requisitos de este documento; ' },
                { _id: 2, description: 'b. Asegurar de que los procesos están generando y proporcionando las salidas previstas relacionadas con el sistema de gestión de la sostenibilidad' },
                { _id: 3, description: 'c. Informar a la alta dirección sobre el desempeño del sistema de gestión de la sostenibilidad y sobre las oportunidades de mejora. ' },
                { _id: 4, description: 'd. Representar a la alta dirección en cuestiones externas relacionadas con el sistema de gestión de la sostenibilidad. ' },
                { _id: 5, description: 'e. Asegurarse de que se promueve el enfoque al cliente en toda la organización; ' },
                { _id: 6, description: 'f. Asegurarse de que la integridad del sistema de gestión de la sostenibilidad se mantiene cuando se planifican e implementan cambios en el sistema de gestión de la sostenibilidad' },
            ]
        },
    ],
    title: 'LIDERAZGO'
});
let dataFormat_3 = ref({
    number: '6',
    requirements: [
        {
            _id: 1,
            description:
            'Al planificar el sistema de gestión de la sostenibilidad, la organización debe considerar las cuestiones mencionadas en el numeral 4.2 y los requisitos del numeral 4.3 y determinar los riesgos y oportunidades que deben abordarse para:',
            number: '6.1.1',
            title: 'Generalidades ',
            inputs: [
                { _id: 1, description: 'asegurar que el sistema de gestión de la sostenibilidad pueda lograr los resultados previstos; - aumentar los efectos deseables - prevenir o reducir efectos indeseados; - lograr una mejora continua. ' },
            ]
        },
        {
            _id: 2,
            description:
            'Al llevar a cabo las actividades de planificación, la organización debe asegurar el cumplimiento operativo y la mejora de los principios rectores del desarrollo sostenible relacionados con la gestión de la organización. Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los servicios de la organización.',
            number: '6.1.1.2',
            title: 'La organización debe planificar:',
            inputs: [
                { _id: 1, description: 'a) acciones para abordar estos riesgos y oportunidades; ' },
                { _id: 2, description: 'b) la manera de: 1) integrar e implementar las acciones en los procesos del sistema de gestión de la sostenibilidad (véase el numeral 7.1); 2) evaluar la eficacia de estas acciones (véase el numeral 8.2). Al llevar a cabo las actividades de planificación, la organización debe asegurar el cumplimiento operativo y la mejora de los principios rectores del desarrollo sostenible relacionados con la gestión de la organización. Las acciones tomadas para abordar los riesgos y oportunidades deben ser proporcionales al impacto potencial en la conformidad de los servicios de la organización. ' },
            ]
        },
        {
            _id: 3,
            description:
            'La organización debe establecer, implementar y mantener un procedimiento para identificar sus cuestiones de desarrollo sostenible y evaluar su importancia en relación con las actividades, productos y servicios del establecimiento de alojamiento dentro del alcance definido del sistema de gestión. El ambiente de alojamiento debe asegurar que se tengan en cuenta los aspectos relacionados con esos impactos al definir sus objetivos de sostenibilidad. La organización debe mantener esta información actualizada. Siempre que se produzcan cambios en el funcionamiento de la organización o se identifiquen nuevas cuestiones emergentes se debe reevaluar los aspectos e impactos relacionados. La identificación y valoración de aspectos e impactos debe ser conforme con los requisitos descritos en los Anexos A (Normativo), B (Normativo) y C (Normativo).Los criterios utilizados para la evaluación de la importancia deben estar documentados y considerar la retroalimentación de las partes interesadas.',
            number: '6.1.2',
            title: 'Identificación y evaluación de cuestiones ',
            inputs: [
                { _id: 1, description: 'La organización debe establecer, implementar y mantener un procedimiento para identificar sus cuestiones de desarrollo sostenible y evaluar su importancia en relación con las actividades, productos y servicios del establecimiento de alojamiento dentro del alcance definido del sistema de gestión. El ambiente de alojamiento debe asegurar que se tengan en cuenta los aspectos relacionados con esos impactos al definir sus objetivos de sostenibilidad. La organización debe mantener esta información actualizada. Siempre que se produzcan cambios en el funcionamiento de la organización o se identifiquen nuevas cuestiones emergentes se debe reevaluar los aspectos e impactos relacionados. La identificación y valoración de aspectos e impactos debe ser conforme con los requisitos descritos en los Anexos A (Normativo), B (Normativo) y C (Normativo).Los criterios utilizados para la evaluación de la importancia deben estar documentados y considerar la retroalimentación de las partes interesadas.' },        
            ]
        },
        {
            _id: 4,
            description:
            'La organización debe establecer objetivos de sostenibilidad en las funciones y niveles pertinentes. Los objetivos de sostenibilidad deben: ',
            number: '6.2.1',
            title: 'Objetivos de sostenibilidad de eventos y cómo lograrlos ',
            inputs: [
                { _id: 1, description: 'a) ser coherentes con la política de desarrollo sostenible; ' },        
                { _id: 2, description: 'b) ser medibles (si es posible);  ' },
                { _id: 3, description: 'c) tener en cuenta los requisitos aplicables;  ' },
                { _id: 4, description: 'd) someterse a seguimiento;  ' },
                { _id: 5, description: 'e) comunicarse;  ' },
                { _id: 6, description: 'f) actualizarse según sea apropiado;' },
            ]
        },
        {
            _id: 5,
            description:
            '',
            number: '6.2.2',
            title: 'La organización debe retener información documentada sobre los objetivos de sostenibilidad. Al planificar cómo lograr sus objetivos de sostenibilidad, la organización debe determinar:  ',
            inputs: [
                { _id: 1, description: '"qué se hará; - qué recursos se requerirán; - quién será responsable; - cuándo se completará; - cómo se evaluarán los resultados." ' },        
            ]
        },
    ],
    title: 'PLANIFICACIÓN	'
});
let dataFormat_4 = ref({
    
    number: '7',
    requirements: [
        {
            _id: 1,
            description:
            'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, la implementación, el mantenimiento y la mejora continua del sistema de gestión de la sostenibilidad.',
            number: '7.1',
            title: 'Recursos',
            inputs: [
                { _id: 1, description: 'La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, la implementación, el mantenimiento y la mejora continua del sistema de gestión de la sostenibilidad.' },
            ]
        },
        {
            _id: 2,
            description:
            'La organización debe:',
            number: '7.2',
            title: 'Competencia La organización debe:',
            inputs: [
                { _id: 1, description: 'a.  determinar la competencia necesaria de la(s) persona(s) que realiza(n) un trabajo bajo su control que afecte el desempeño de su sostenibilidad; ' },
                { _id: 2, description: 'b. asegurar que esas personas sean competentes sobre la base de una educación, formación o experiencia apropiadas; ' },
                { _id: 3, description: 'c. cuando sea aplicable, emprender acciones para adquirir la competencia necesaria y evaluar la eficacia de las acciones emprendidas; y' },
                { _id: 4, description: 'd. retener la información documentada apropiada como evidencia de su competencia; ' },
                { _id: 5, description: 'e. revisar y actualizar periódicamente los programas de formación y desarrollo para asegurar que se identifiquen y proporcionen las competencias esenciales y las necesidades de formación asociadas. ' },
                
            ]
        },
        {
            _id: 3,
            description:
            'Las personas que realicen trabajos bajo el control de la organización deben tomar conciencia de: ',
            number: '7.3',
            title: 'Toma de conciencia ',
            inputs: [
                { _id: 1, description: 'a. política de desarrollo sostenible; ' },
                { _id: 2, description: 'b. su contribución a la eficacia del sistema de gestión de la sostenibilidad, incluidos los beneficios de la mejora del desempeño de la sostenibilidad;' },
                { _id: 3, description: 'c. las implicaciones de no cumplir con los requisitos del sistema de gestión de sostenibilidad; ' },
                { _id: 4, description: 'd. las posibles consecuencias del incumplimiento de los procedimientos operativos especificados y los impactos ambientales, socioculturales o económicos importantes, reales o potenciales, de las actividades de la organización.' },
            ]
        },
        {
            _id: 4,
            description:
            'La organización debe determinar la necesidad de comunicaciones internas y externas pertinentes para el sistema de gestión de la sostenibilidad, incluyendo:',
            number: '7.4.1',
            title: 'Comunicación ',
            inputs: [
                { _id: 1, description: 'a. sobre qué comunicará;  ' },
                { _id: 2, description: 'b. cuándo comunicar;  ' },
                { _id: 3, description: 'c. con quien comunicarse; ' },
                { _id: 4, description: 'd. cómo comunicarse.  ' },
          ]
        },
        {
            _id: 5,
            description:
            'La organización debe identificar, con sus partes interesadas, los medios de comunicación más eficaces y debe tener en cuenta los intereses de esos diferentes grupos. Las comunicaciones deben incluir, cuando proceda, lo siguiente:',
            number: '7.4.2',
            title: 'La organización debe identificar, con sus partes interesadas, los medios de comunicación más eficaces y debe tener en cuenta los intereses de esos diferentes grupos. Las comunicaciones deben incluir, cuando proceda, lo siguiente:',
            inputs: [
                { _id: 1, description: 'principios, políticas y objetivos; - las mejores prácticas para alcanzar los objetivos; - relevancia para las partes interesadas; - desempeño del sistema de gestión de la sostenibilidad; - retroalimentación de partes interesadas.  ' },
          ]
        },
        {
            _id: 6,
            description:
            'El sistema de gestión de la sostenibilidad de la organización debe incluir:',
            number: '7.5.1',
            title: 'Información documentada Generalidades ',
            inputs: [
                { _id: 1, description: 'a. a información documentada requerida por este documento;' },
                { _id: 2, description: 'b. La información documentada que la organización determine como necesaria para la eficacia del sistema de gestión de la sostenibilidad. ' },
          ]
        },
        {
            _id: 7,
            description:
            'Al crear y actualizar la información documentada, la organización debe asegurar que sean apropiados:',
            number: '7.5.2',
            title: 'Creación y actualización ',
            inputs: [
                { _id: 1, description: 'la identificación y descripción (por ejemplo, un título, una fecha, un autor o un número de referencia); - el formato (por ejemplo, el idioma, la versión de software, los gráficos) y los medios (por ejemplo, papel, electrónico); - la revisión y aprobación de la idoneidad y la adecuación.' },
          ]
        },
        {
            _id: 8,
            description:
            'La información documentada requerida por el sistema de gestión de la sostenibilidad y por este documento debe ser controlada para asegurar:   ',
            number: '7.5.3',
            title: 'Control de la información documentada ',
            inputs: [
                { _id: 1, description: 'a) que esté disponible y sea adecuada para uso, donde y cuando se necesite;' },
                { _id: 2, description: 'b. que esté adecuadamente protegida (por ejemplo, contra la pérdida de confidencialidad, el uso indebido o la pérdida de integridad).' },
          ]
        },
        {
            _id: 9,
            description:
            'La información documentada requerida por el sistema de gestión de la sostenibilidad y por este documento debe ser controlada para asegurar: ',
            number: '7.5.3.2',
            title: 'Para el control de la información documentada, la organización debe abordar las siguientes actividades, según proceda:  ',
            inputs: [
                { _id: 1, description: 'distribución, acceso, recuperación y uso; - almacenamiento y conservación, incluida la preservación de la legibilidad; - control de cambios (por ejemplo, el control de versiones); - retención y disposición; - prevención del uso de información obsoleta. La información documentada de origen externo que la organización determine que es necesaria para la planificación y la operación del sistema de gestión de la sostenibilidad se debe identificar según corresponda, y se debe controlar.' },
         ]
        },
    ],
    title: 'APOYO'
});
let dataFormat_5 = ref({
    number: '8',
    requirements: [
        {
            _id: 1,
            description:
            'La organización debe planificar, implementar y controlar los procesos necesarios para cumplir los requisitos, e implementar las acciones determinadas en el numeral 6.1, de la siguiente forma:',
            number: '8.1',
            title: 'OPERACIÓN Planificación y control operacional ',
            inputs: [
                { _id: 1, description: 'a) estableciendo criterios para los procesos; ' },
                { _id: 2, description: 'b) implementando el control de los procesos de acuerdo con los criterios; ' },
                { _id: 3, description: 'c) manteniendo la información documentada en la medida necesaria para tener la confianza de que los procesos se han llevado a cabo según lo planeado. En particular, la organización debe identificar las operaciones y actividades relacionadas con los aspectos de la sostenibilidad que tengan o puedan tener un impacto significativo, donde las acciones de control se requieran implementar. Al planificar e implementar las acciones de control, éstas deben, cuando sea apropiado, cumplir con los requisitos contenidos en los Anexos A (Normativos), B (Normativos) y C (Normativos). La organización debe controlar los cambios planificados y examinar las consecuencias de los cambios no intencionados, tomando acciones para mitigar cualquier efecto adverso, según sea necesario. La organización se debe asegurar de que se controlen los procesos contratados externamente.' },
            ]
        },
        {
            _id: 2,
            description:
            'Cuando se encuentren actividades, productos o servicios nuevos o modificados, o se cambian las circunstancias operativas, se deben revisar y modificarse, según corresponda, las cuestiones, los objetivos, las metas y el(los) plan(es) para asegurar que se entregue la mejor solución general de acuerdo con la declaración de propósito, los valores y la política de desarrollo sostenible de la organización.',
            number: '8.2',
            title: 'Tratamiento de actividades, productos o servicios modificados ',
            inputs: [
                { _id: 1, description: 'Cuando se encuentren actividades, productos o servicios nuevos o modificados, o se cambian las circunstancias operativas, se deben revisar y modificarse, según corresponda, las cuestiones, los objetivos, las metas y el(los) plan(es) para asegurar que se entregue la mejor solución general de acuerdo con la declaración de propósito, los valores y la política de desarrollo sostenible de la organización.' },
          ]
        },
        {
            _id: 3,
            description:
            'La organización debe establecer y comunicar los criterios para su selección de proveedores, teniendo en cuenta los aspectos, impactos y objetivos de sostenibilidad, con el fin de minimizar los impactos de su operación en la sostenibilidad. La organización debe evaluar a sus proveedores con base en los criterios establecidos. ',
            number: '8.3',
            title: 'Gestión de la cadena de suministro ',
            inputs: [
                { _id: 1, description: 'La organización debe establecer y comunicar los criterios para su selección de proveedores, teniendo en cuenta los aspectos, impactos y objetivos de sostenibilidad, con el fin de minimizar los impactos de su operación en la sostenibilidad. La organización debe evaluar a sus proveedores con base en los criterios establecidos.'},
          ]
        },
    ],
    title: 'OPERACIÓN'
});
let dataFormat_6 = ref({
    number: '9',
    requirements: [
        {
            _id: 1,
            description:
            'La organización debe determinar: ',
            number: '9.1',
            title: 'Seguimiento, medición, análisis y evaluación  ',
            inputs: [
                { _id: 1, description: 'a qué se debe realizar seguimiento y medición; - los métodos de seguimiento, medición, análisis y evaluación, según proceda, para asegurar resultados válidos; - cuándo se debe realizar el seguimiento y la medición; - cuándo se deben analizar y evaluar los resultados del seguimiento y la medición. La organización debe retener la información documentada apropiada como evidencia de los resultados. La organización debe evaluar el desempeño en materia de sostenibilidad y la eficacia del sistema de gestión de la sostenibilidad.' },
          ]
        },
        {
            _id: 2,
            description:
            'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información sobre si el sistema de gestión de la sostenibilidad: ',
            number: '9.2',
            title: 'Auditoría interna La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información sobre si el sistema de gestión de la sostenibilidad:  ',
            inputs: [
                { _id: 1, description: 'a) es conforme con: - los propios requisitos de la organización para su sistema de gestión de la sostenibilidad;- los requisitos de este documento;' },
                { _id: 2, description: 'b) se implementa y mantiene eficazmente. ' },
          ]
        },
        {
            _id: 3,
            description:
            'La organización debe llevar a cabo auditorías internas a intervalos planificados para proporcionar información sobre si el sistema de gestión de la sostenibilidad: ',
            number: '9.2.1',
            title: ' La organización debe:',
            inputs: [
                { _id: 1, description: 'a) planificar, establecer, implementar y mantener un programa o programas de auditoría (incluida la frecuencia, los métodos, las responsabilidades, los requisitos de planificación y la presentación de informes), en los que se debe tomar en consideración la importancia de los procesos en cuestión y los resultados de las auditorías anteriores;' },
                { _id: 2, description: 'b) definir los criterios y el alcance de cada auditoría; ' },
                { _id: 3, description: 'c) seleccionar a los auditores y realizar auditorías para asegurar la objetividad y la imparcialidad del proceso de auditoría;' },
                { _id: 4, description: 'd)  asegurar que los resultados de las auditorías se comuniquen a los directores pertinentes; ' },
                { _id: 5, description: 'e) retener la información documentada como evidencia de la implementación del programa de auditoría y de los resultados de esta. Siempre que sea posible, las auditorías deben ser realizadas por trabajadores independientes de los que tengan responsabilidad directa en la actividad examinada. ' },
          ]
        },
        {
            _id: 4, 
            description:
            'La alta dirección debe revisar el sistema de gestión de la sostenibilidad de la organización, a intervalos planificados, para asegurar su continua idoneidad, adecuación y eficacia. La revisión por la dirección debe incluir la consideración de: ',
            number: '9.3',
            title: 'Revisión por la dirección  ',
            inputs: [
                { _id: 1, description: 'a) el estado de las acciones de las revisiones por la dirección previas ' },
                { _id: 2, description: 'b) los cambios en las cuestiones externas e internas que son pertinentes para el sistema de gestión de la sostenibilidad; ' },
                { _id: 3, description: 'c) información sobre el desempeño en materia de sostenibilidad, incluidas las tendencias en: - la satisfacción del cliente y la retroalimentación de las partes interesadas pertinentes; - el desempeño de los procesos y conformidad de los productos y servicios; - las no conformidades y las acciones correctivas; - los resultados de la evaluación del seguimiento y la medición;resultados de la auditoría. - El desempeño de los proveedores externos ' },
                { _id: 4, description: 'd) oportunidades de mejora continua. ' },
                { _id: 5, description: 'e) las comunicaciones con las partes interesadas y los cambios en las expectativas de las partes interesadas; ' },
                { _id: 6, description: 'f) el grado de cumplimiento de los objetivos. ' },
                { _id: 7, description: 'g) la eficacia de las acciones tomadas para abordar los riesgos y las oportunidades (véase el numeral 6.1).En las revisiones por la dirección se debe evaluar la necesidad de introducir cambios en el sistema de gestión de la sostenibilidad, incluida la declaración de propósitos y valores, la política de desarrollo sostenible y los objetivos y metas, de acuerdo con el seguimiento y control de los resultados, los cambios y el compromiso con la mejora continua.Los resultados de la revisión por la dirección deben incluir decisiones relacionadas con las oportunidades de mejora continua y la necesidad de introducir cambios en el sistema de gestión de la sostenibilidad. La organización debe retener la información documentada como evidencia de los resultados de las revisiones por la dirección. ' },
          ]
        },
    ],
    title: 'EVALUACIÓN DEL DESEMPEÑO'
});
let daataFormat_7 = ref({
    number: '10',
    requirements: [
        {
            _id: 1,
            description:'Cuando se produzca una no conformidad, la organización debe:',
            number: '10.1',
            title: 'Mejora No conformidad y acción correctiva  ',
            inputs: [
                { _id: 1, description: 'a) identificar la no conformidad;  ' },
                { _id: 2, description: 'b) reaccionar ante la no conformidad y, según se aplique: - tomar acciones para controlarla y corregirla; - manejar las consecuencias; ' },
                { _id: 3, description: 'c) evaluar la necesidad de acciones para eliminar la causa o causas de la no conformidad, a fin de que ésta no vuelva a producirse o se produzca en otro lugar, mediante: - revisar la no conformidad; - determinar las causas de la no conformidad; - determinar si existen no conformidades similares, o que pudieran ocurrir potencialmente  ' },
                { _id: 4, description: 'd) implementar cualquier acción necesaria;  ' },
                { _id: 5, description: 'e) revisar la eficacia de toda acción correctiva tomada;  ' },
                { _id: 6, description: 'f) realizar cambios en el sistema de gestión de la sostenibilidad, si es necesario. Las acciones correctivas deben ser adecuadas para los efectos de las no conformidades encontradas. La organización debe retener la información documentada como evidencia de: - la naturaleza de las no conformidades y las consecuentes acciones tomadas, - los resultados de cualquier acción correctiva.  ' },
          ]
        },
        {
            _id: 2,
            description:'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la sostenibilidad. ',
            number: '10.2',
            title: 'Mejora continua ',
            inputs: [
                { _id: 1, description: 'La organización debe mejorar continuamente la idoneidad, adecuación y eficacia del sistema de gestión de la sostenibilidad. ' },
          ]
        },
    ],
    title: 'MEJORA'
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
        const { data } = await getNormApi();
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