<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>PLAN DE TRABAJO</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" /> -->

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de plan de trabajo  -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="workPlans"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <!-- <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" /> -->
                <Column field="indicator" header="NUMERAL" :sortable="true" style="width: 10%">
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
                <Column field="dateCompliance" header="FECHA DE CUMPLIMIENTO" :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        {{ formatDate(slotProps.data?.dateCompliance) }}
                    </template>
                </Column>

                <Column field="owner" header="ENCARGADOS" :sortable="true" style="width: 15%">
                    <template #body="slotProps"> {{ getResponsibleness(slotProps.data?.responsibleness) }}</template>
                </Column>
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog(slotProps.data)" dense round />
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

    <!-- Modal para agregar/editar plan de trabajo -->
    <q-dialog v-model="workPlanDialog" persistent>
        <div class="container bg-white" style="width: 90vw; max-width: 90vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveWorkPlan" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                RESOLUCIÓN 0312

                                {{ workPlan?.title ? ` - ${workPlan.title}` : '' }}
                            </div>
                        </q-card-section>
                        <!-- <div class="w-full q-px-md">
                            <div class="text-bold">Objetivo</div>
                            <q-input v-model="workPlan.goal" outlined dense autogrow />
                        </div>
                        <div class="w-full q-px-md q-mt-md">
                            <div class="text-bold">Meta:</div>
                            <q-input v-model="workPlan.objective" outlined dense autogrow />
                        </div> -->
                        <div class="table-container q-mt-xl">
                            <table class="full-width">
                                <thead>
                                    <tr>
                                        <th class="text-left">Numeral</th>
                                        <th class="text-left">Requisito</th>
                                        <!-- <th class="text-left">Criterios</th> -->
                                        <th class="text-left">Plan de acción (Actividades)</th>
                                        <th class="text-left">Responsable</th>
                                        <th class="text-left">Plazo de cumplimiento</th>
                                        <th class="text-left">Renovación</th>
                                        <th class="text-left">Soportes sugeridos</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="width: 80px; max-width: 80px; min-width: 80px">
                                            {{ workPlan.indicator }}
                                        </td>
                                        <td style="width: 180px; max-width: 180px; min-width: 180px">
                                            {{ workPlan.description }}
                                        </td>
                                        <!-- <td style="width: 200px; max-width: 200px; min-width: 200px">
                                            <template v-for="(input, index) in workPlan.criteria">
                                                <q-input class="q-mt-md q-mx-xs" v-model="input.value" dense outlined :label="'Criterio ' + (index + 1)" autogrow>
                                                    <template v-slot:append>
                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInputCriteria(index)" />
                                                    </template>
                                                </q-input>
                                            </template>
                                            <q-btn class="q-mt-md" dense rounded color="primary" icon="add" @click="addInputCriteria()" />
                                        </td> -->

                                        <td style="width: 180px; max-width: 180px; min-width: 180px">
                                            <template v-for="(input, index) in workPlan.activities">
                                                <q-input class="q-mt-md q-mx-xs" v-model="input.value" dense outlined :label="'Actividad ' + (index + 1)" autogrow>
                                                    <template v-slot:append>
                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInputActivities(index)" />
                                                    </template>
                                                </q-input>
                                            </template>
                                            <q-btn class="q-mt-md" dense rounded color="primary" icon="add" @click="addInputActivities()" />
                                        </td>
                                        <td style="width: 150px; max-width: 150px; min-width: 150px">
                                            <template v-for="(input, index) in workPlan.responsibleness">
                                                <q-select class="q-mt-md q-mx-xs" dense outlined :label="'Responsable ' + (index + 1)" :options="users" v-model="input.value">
                                                    <template v-slot:append>
                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInputResponsibleness(index)" />
                                                    </template>
                                                </q-select>
                                            </template>
                                            <q-btn class="q-mt-md" dense rounded color="primary" icon="add" @click="addInputResponsibleness()" />
                                        </td>
                                        <td style="width: 120px; max-width: 120px; min-width: 120px">
                                            <q-input class="q-mt-md q-mx-xs" outlined dense v-model="workPlan.dateCompliance" mask="date" :rules="['date']">
                                                <template v-slot:append>
                                                    <q-icon name="event" class="cursor-pointer">
                                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                            <q-date v-model="workPlan.dateCompliance" :options="optionsDate">
                                                                <div class="row items-center justify-end">
                                                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                                                </div>
                                                            </q-date>
                                                        </q-popup-proxy>
                                                    </q-icon>
                                                </template>
                                            </q-input>
                                        </td>
                                        <td style="width: 80px; max-width: 80px; min-width: 80px">
                                            {{ calculatedRenovation(workPlan.renovation) }}
                                        </td>
                                        <td style="width: 200px; max-width: 200px; min-width: 200px">
                                            <template v-for="(input, index) in workPlan.suggestedEvidence" :key="index">
                                                <q-input class="q-mt-md q-mx-xs" v-model="input.value" dense outlined :label="'Soporte ' + (index + 1)" autogrow>
                                                    <template v-slot:append>
                                                        <q-btn round dense flat icon="minimize" color="red" @click="removeInputSuggestedEvidence(index)" />
                                                    </template>
                                                </q-input>
                                            </template>
                                            <q-btn class="q-mt-md" dense rounded color="primary" icon="add" @click="addInputSuggestedEvidence()" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
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
import { getUsersApi } from '@/api/users';
import { editWorkPlanApi, getWorkPlanApi } from '@/api/worksPlans.js'; //ROLES
import { storeAuth } from '@/store/auth';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const workPlans = ref([]);
const workPlanDialog = ref(false);
const workPlan = ref();
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
    { label: 'Mensual', value: 5 }
]);

const useStoreAuth = storeAuth();
const enterprise = ref(null);
onBeforeMount(async () => {
    enterprise.value = useStoreAuth.getSelectedCompany();
    await getWorksPlan();
    await getUsers();
});
let dataUsers = ref([]);
let users = ref([]);

async function getUsers() {
    try {
        const { data } = await getUsersApi([enterprise.value.value]);
        dataUsers.value = data.length ? data : [];
        users.value = dataUsers.value.map((user) => ({ label: user.username, value: user._id }));
    } catch (error) {
        console.error(error);
    }
}

async function getWorksPlan() {
    try {
        const { data } = await getWorkPlanApi(enterprise.value.value);
        workPlans.value = Array.isArray(data) ? data : [];

        workPlans.value?.sort((a, b) => {
            let aIndicator = a.indicator
                .split('.')
                .map((i) => i.padStart(2, '0'))
                .join('');
            let bIndicator = b.indicator
                .split('.')
                .map((i) => i.padStart(2, '0'))
                .join('');

            return aIndicator - bIndicator;
        });
    } catch (error) {
        console.error('Error al obtener datos de qualifications:', error);
        workPlans.value = []; // Asigna un array vacío para evitar futuros errores
    }
}

function getResponsibleness(responsibleness) {
    if (!responsibleness || !responsibleness.length) return '';

    return responsibleness.map((r) => dataUsers.value.find((u) => u._id == r.value)?.username).join(', ');
}

function calculatedRenovation(value) {
    return renovationOptions.value.find((r) => r.value == value)?.label;
}

function openDialog(data) {
    let defaultSuggestedEvidence = [
        'Firma por parte de los empleados de la comunicación y entendimiento de las responsabilidadas, autoridad y rendición de cuentas de cada rol dentro del Sistema de gestión'
    ];
    const req = { ...data };

    console.log('req', req);


    //separar al actividades sugeridas por cada salto de linea con n
    if (req?.suggestedEvidence) {
        req.suggestedEvidence = req.suggestedEvidence[0].split('\n').map((e) => ({ value: e }));
        console.log('suggestedEvidence', req.suggestedEvidence);
    }

    if (req.indicator == '1.1.1') {
        defaultSuggestedEvidence.forEach((e) => {
            const exist = req.suggestedEvidence.some((s) => s.value === e);;
            if (!exist) {
                req.suggestedEvidence.push({ value: e });
            }
        });
    }

    workPlan.value = {
        ...req,
        criteria: [{ value: '' }],
        activities: [{ value: '' }],
        responsibleness: req?.responsibleness?.map((r) => ({ value: r })) || [{ value: '' }],
        dateCompliance: req?.dateCompliance ? formatDate(req.dateCompliance) : null,
        // goal: req?.goal,
        // objective: req?.objective,
        title: req?.title
    };

    if (req?.criteria && req.criteria.length) {
        workPlan.value.criteria = req.criteria.map((c) => ({ value: c }));
        workPlan.value.activities = req.activities.map((a) => ({ value: a }));
    }

    workPlanDialog.value = true;
}

function formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');

    return `${year}/${month}/${day}`;
}

function hideDialog() {
    workPlanDialog.value = false;
}

async function saveWorkPlan() {
    const data = {
        requirement: workPlan.value.requirement,
        id: workPlan.value.id,
        idQualification: workPlan.value.idQualification,
        // goal: workPlan.value.goal,
        // objective: workPlan.value.objective,
        dateCompliance: workPlan.value.dateCompliance,
        activities: workPlan.value.activities.map((a) => a.value),
        criteria: workPlan.value.criteria.map((c) => c.value),
        responsibleness: workPlan.value.responsibleness.map((r) => r.value),
        suggestedEvidence: workPlan.value.suggestedEvidence.map((s) => s.value)?.join('\n')
    };

    console.log(data);

    try {
        await editWorkPlanApi(data);

        Notify.create({
            message: 'Plan de trabajo actualizado correctamente',
            color: 'positive',
            position: 'top',
            timeout: 2000
        });

        workPlanDialog.value = false;
        await getWorksPlan();
    } catch (error) {
        console.error('Error al guardar el plan de trabajo:', error);
        Notify.create({
            message: 'Error al guardar el plan de trabajo',
            color: 'negative',
            position: 'top',
            timeout: 2000
        });
    }
}

function addInputCriteria() {
    workPlan.value.criteria.push({ value: '' });
}

function removeInputCriteria(index) {
    workPlan.value.criteria.splice(index, 1);
}

function addInputActivities() {
    workPlan.value.activities.push({ value: '' });
}

function removeInputActivities(index) {
    workPlan.value.activities.splice(index, 1);
}

function addInputResponsibleness() {
    workPlan.value.responsibleness.push({ value: '' });
}

function removeInputResponsibleness(index) {
    workPlan.value.responsibleness.splice(index, 1);
}

function removeInputSuggestedEvidence(index) {
    workPlan.value.suggestedEvidence.splice(index, 1);
}

function addInputSuggestedEvidence() {
    workPlan.value.suggestedEvidence.push({ value: '' });
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = workPlans.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}

function optionsDate(date) {
    //solo se puede seleccionar fechas mayores a la actual
    const dateCurrent = new Date();
    const year = dateCurrent.getFullYear();
    const month = dateCurrent.getMonth() + 1;
    const day = dateCurrent.getDate();

    return date > `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
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

.table-container {
    overflow-x: auto;
}

.table-work,
thead,
tbody,
tr,
th,
td {
    text-align: center;
    border: 0.5px solid;
}
</style>
