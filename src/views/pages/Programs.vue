<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>PROGRAMAS</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de programas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="programs"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 20%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 20%" />
                <Column field="responsibility.username" header="RESPONSABLE" style="width: 20%" />
                <Column v-if="role?.type == 'SUPERADMIN'" field="enterprise.name" header="EMPRESA" style="width: 20%" />
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editProgram(slotProps.data)" dense round />
                            <q-btn icon="visibility" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="viewActivities(slotProps.data)" dense round class="q-mr-xs" />
                            <q-btn icon="delete" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="deleteProgram(slotProps.data._id)" dense round class="q-mr-xs" />

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del programa: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar programa -->
    <q-dialog v-model="programDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveProgram" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ program._id ? 'EDITAR PROGRAMA' : 'NUEVO PROGRAMA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del programa requerido']" v-model="program.name" label="Nombre del programa" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="program.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>

                                <div class="col-6" v-if="role?.type == 'SUPERADMIN'">
                                    <q-select
                                        v-model="program.enterprise"
                                        :options="enterprises"
                                        label="Empresa"
                                        required
                                        style="padding: 10px"
                                        @update:model-value="
                                            program.responsibility = null;
                                            getUsers();
                                        "
                                    />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="program.responsibility" :options="users" label="Responsable" required style="padding: 10px" />
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog()" />
                            <q-btn class="q-mx-sm" outline label="Guardar" color="primary" type="submit" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>

    <!-- Modal para ver actividades del programa -->
    <q-dialog v-model="activitiesDialog" persistent width="600px">
        <div class="container bg-white" style="width: 100%; max-width: 70vw; height: 80vh; overflow: auto">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width q-pa-lg">
                    <q-card-section>
                        <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">{{ program.name }}</div>
                    </q-card-section>

                    <q-card-section>
                        <!-- Aquí puedes agregar el contenido para mostrar las actividades del programa -->
                        <p>{{ program.description }}</p>
                    </q-card-section>

                    <q-card-section class="full-width">
                        <!-- Aquí puedes agregar el contenido para mostrar las actividades del programa -->
                        <q-card class="q-mt-md bg-grey-1 row">
                            <q-card-section class="col-6">
                                <div class="text-h6 text-primary text-h5" style="font-weight: bold">Actividades</div>
                                <p class="text-body1 text-gray-400">Responsable: {{ program.responsibility?.name || 'No asignado' }}<br /></p>
                            </q-card-section>
                            <q-card-section class="col-6">
                                <span class="text-body1 bg-grey-12 q-pa-sm" style="border-radius: 20px; color: green; font-weight: bold; display: flex; align-items: center; justify-content: center">
                                    <q-icon :name="validatedActivities(program.activities) ? 'check_circle' : 'warning'" :color="validatedActivities(program.activities) ? 'primary' : 'orange'" size="20px" />
                                    {{ validatedActivities(program.activities) ? 'Todas las actividades están completas' : 'Hay actividades pendientes' }}
                                </span>
                            </q-card-section>

                            <q-card-section class="col-6 row">
                                <div class="col-12">
                                    <q-btn color="primary" rounded="" label="Generar por IA" @click="generateActivities" />
                                </div>
                                <div class="col-12 overflow-y-auto" style="max-height: 300px; margin-top: 10px">
                                    <!-- Cada actividad tiene un check y un texto descriptivo -->

                                    <div v-for="(activity, index) in program.activities" :key="index" class="q-mt-md row items-center bg-grey-12" style="font-weight: bold; font-size: 16px; border-radius: 20px">
                                        <!-- cuando se cambie el checkbox eliminar o agregar la endDate -->
                                        <q-checkbox v-model="activity.completed" @update:model-value="updateActivityDates(index)" />

                                        <!-- Input con icono de eliminar en la parte derecha -->
                                        <q-input v-model="activity.name" borderless placeholder="Actividad" autogrow class="flex-1">
                                            <template v-slot:append>
                                                <q-btn icon="delete" flat round dense color="negative" @click="deleteActivity(index)" :disable="program.activities.length <= 1" />
                                            </template>
                                        </q-input>
                                    </div>
                                    <!-- Botón para agregar actividad -->
                                    <div class="q-mt-md full-width justify-center flex">
                                        <q-btn color="primary" icon="add" rounded @click="addActivity" />
                                    </div>
                                </div>
                            </q-card-section>

                            <q-card-section class="col-6 row" style="overflow: auto">
                                <apexchart style="width: 100%" type="line" height="350" :options="chartOptions" :series="series"></apexchart>
                            </q-card-section>
                        </q-card>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn class="q-mx-sm" outline label="Cerrar" color="negative" @click="activitiesDialog = false;getProgram()" />
                    </q-card-actions>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { getEnterprisesApi } from '@/api/enterprises';
import { addActivityApi, createProgramApi, deleteProgramApi, editProgramApi, generateManual, getProgramApi, removeActivityApi } from '@/api/programs';
import { getUsersApi } from '@/api/users';
import { storeAuth } from '@/store/auth';
import { Notify } from 'quasar';
import { onBeforeMount, ref, watch } from 'vue';

const useStoreAuth = storeAuth();

const series = ref([
    {
        name: 'Cumplimiento',
        data: [null, null, null, null, null, null, null, null, null, null, null, null]
    }
]);

const chartOptions = ref({});

const setConfig = async () => {
    chartOptions.value = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Nivel De Cumplimiento',
            align: 'center'
        },
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    legend: {
                        position: 'bottom'
                    },
                    xaxis: {
                        tickAmount: 4
                    }
                }
            }
        ],

        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: {
                    fontSize: '12px'
                }
            },
            tickAmount: 10
            // min: 0,
            // max: 100,
        },
        yaxis: {
            title: {
                text: 'Porcentaje de Cumplimiento'
            },
            min: 0,
            max: 100,
            tickAmount: 20,
            labels: {
                formatter: (val) => `${val ? val.toFixed(0) : 0}`
            }
        },
        markers: {
            size: 1,
            colors: ['#008ffb'],
            strokeColors: '#008ffb',
            strokeWidth: 2,
            hover: {
                sizeOffset: 3
            }
        }
    };
};

const role = ref(null);
const enterprise = ref(null);
const enterprises = ref([]);
const users = ref([]);
const programs = ref([]);
const programDialog = ref(false);
const activitiesDialog = ref(false);
const program = ref({
    id: null,
    name: '',
    description: '',
    responsibility: null,
    enterprise: null,
    activities: []
});
const expandedRows = ref([]);

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Mapa para guardar los debounce por actividad
const debouncedUpdateName = {};

// Watcher para cada nombre de actividad
watch(
    () => program.value?.activities?.map(a => a.name),
    (newNames, oldNames) => {
        newNames?.forEach((name, idx) => {
            if (!oldNames) return; // Si oldNames es undefined, salir
            
            if (name !== oldNames[idx]) {
                if (!debouncedUpdateName[idx]) {
                    debouncedUpdateName[idx] = debounce(async (index) => {
                        const activity = program.value.activities[index];
                        await addActivityApi({
                            idProgram: program.value._id,
                            idActivity: activity._id,
                            name: activity.name,
                            completed: activity.completed
                        });
                    }, 600); // 600ms debounce
                }
                debouncedUpdateName[idx](idx);
            }
        });
    }
);

onBeforeMount(async () => {
    await setConfig();
    await getProgram();

    //valida si es super admin

    role.value = useStoreAuth.getRoleToken();

    if (role.value.type == 'SUPERADMIN') {
        await getEnterprises();
    } else {
        enterprise.value = useStoreAuth.getSelectedCompany();
        console.log(enterprise.value);
        program.value.enterprise = enterprise.value.value;
        await getUsers();
        console.log('No es superadmin, obteniendo empresa seleccionada');
    }

    console.log(enterprise.value);
});

async function getEnterprises() {
    try {
        const response = await getEnterprisesApi();
        enterprises.value = response.data.map((enterprise) => ({
            label: enterprise.name,
            value: enterprise._id
        }));

        console.log(enterprises.value);
    } catch (error) {
        console.error('Error al obtener las empresas:', error);
    }
}

async function getUsers() {
    try {
        const response = await getUsersApi([program.value.enterprise.value]);

        users.value = response.data.map((user) => ({
            label: user.username,
            value: user._id
        }));
    } catch (error) {
        console.error('Error al obtener las empresas:', error);
    }
}

async function getProgram() {
    try {
        const { data } = await getProgramApi();
        programs.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    program.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        responsibility: null,
        enterprise: enterprise.value ? enterprise.value.value : null
    };
    programDialog.value = true;
}

function hideDialog() {
    programDialog.value = false;
}

async function saveProgram() {
    console.log(program.value);

    if (program.value._id) {
        const programApi = {
            id: program.value._id,
            name: program.value.name,
            description: program.value.description,
            responsibility: program.value.responsibility.value,
            enterprise: program.value.enterprise.value
        };

        const response = await editProgramApi(programApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Programa actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getProgram();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el programa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const programApi = {
            name: program.value.name,
            description: program.value.description,
            responsibility: program.value.responsibility.value,
            enterprise: program.value.enterprise.value
        };

        const response = await createProgramApi(programApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Programa creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getProgram();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el programa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

async function editProgram(selectedProgram) {
    program.value = { ...selectedProgram };

    program.value.enterprise = {
        label: selectedProgram.enterprise.name,
        value: selectedProgram.enterprise._id
    };
    program.value.responsibility = {
        label: selectedProgram.responsibility.username,
        value: selectedProgram.responsibility._id
    };

    await getUsers();

    programDialog.value = true;
    console.log(program.value);
}

//funcion activar desactivar programa
async function deleteProgram(id) {
    try {
        const response = await deleteProgramApi(id);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Programa eliminado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getProgram();
        } else {
            Notify.create({ message: 'Error al eliminar el programa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } catch (error) {
        console.error('Error al eliminar el programa:', error);
    }
}

async function generateActivities() {
    // Aquí puedes implementar la lógica para generar actividades por IA
    const data = {
        id: program.value._id,
        name: program.value.name,
        description: program.value.description,
        activities: program.value.activities.map((activity) => activity.name)
    };

    const response = await generateManual(data);
    console.log('response', response);

    //agregar las actividades generadas al programa
    program.value.activities.push(
        ...response.data.map((item) => ({
            name: item.name,
            completed: false,
            description: '',
            startDate: new Date(),
            endDate: null
        }))
    );

    console.log(response);
}

function viewActivities(programData) {
    program.value = null;
    // Aquí puedes implementar la lógica para mostrar las actividades del programa
    console.log('program', programData);
    program.value = { ...programData };
    console.log(program.value);
    activitiesDialog.value = true;
    updateGraph();
}

function validatedActivities(activities) {
    console.log('activities', activities);
    // Verifica si todas las actividades tienen el campo 'completed' en true
    return true;
}

async function deleteActivity(index) {
    // Elimina la actividad del array pero no se elimina si es la última
    if (program.value.activities.length > 1) {
        // Agrega una nueva actividad al array
        try {
            console.log('program.value.activities[index]', program.value.activities[index]);
            const data = {
                idProgram: program.value._id,
                idActivity: program.value.activities[index]._id
            };
            const response = await removeActivityApi(data);
            program.value.activities.splice(index, 1);
        } catch (error) {
            console.error('Error al agregar actividad:', error);
            Notify.create({ message: 'Error al agregar actividad.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
            return;
        }
    } else {
        Notify.create({ message: 'Debe haber al menos una actividad.', type: 'warning', position: 'top', textColor: 'white', color: 'orange', multiLine: true });
    }
    updateGraph();
}

async function addActivity() {
    try {
        const data = {
            idProgram: program.value._id,
            idActivity: null,
            name: '',
            completed: false
        };
        const response = await addActivityApi(data);

        console.log('response', response);

        const activity = response.data.activity;

        program.value?.activities.push({
            _id: activity._id,
            name: activity.name,
            completed: activity.completed,
            description: activity.description,
            startDate: new Date(),
            endDate: null
        });
        updateGraph();
    } catch (error) {
        console.error('Error al agregar actividad:', error);
        Notify.create({ message: 'Error al agregar actividad.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        return;
    }
}

async function updateActivityDates(index) {
    const activity = program.value.activities[index];
    if (activity.completed) {
        //generar un numero aleatorio entre 1 y 12
        // const randomMonth = Math.floor(Math.random() * 12);
        // activity.endDate = new Date(new Date().getFullYear(), randomMonth, 1);
        activity.endDate = new Date();
        console.log('activity.endDate', activity.endDate);
    } else {
        activity.endDate = null;
    }
    await addActivityApi({
        idProgram: program.value._id,
        idActivity: activity._id,
        name: activity.name,
        completed: activity.completed
    });
    updateGraph();
}

function updateGraph() {
    const completedActivities = program.value.activities.filter((activity) => activity.completed);
    const totalActivities = program.value.activities.length;

    const monthlyCompletion = Array(12).fill(0);

    completedActivities.forEach((activity) => {
        const date = new Date(activity.endDate);
        if (activity.endDate) {
            const month = date.getMonth(); // Obtiene el mes de la fecha de finalización
            monthlyCompletion[month] += 100 / totalActivities; // Suma el porcentaje de actividad completada al mes correspondiente
        }
    });

    // Acumula los porcentajes mes a mes
    for (let i = 1; i < monthlyCompletion.length; i++) {
        monthlyCompletion[i] += monthlyCompletion[i - 1];
    }

    // Actualiza la serie de datos del gráfico
    series.value[0].data = monthlyCompletion.map((value, index) => ({
        x: chartOptions.value.xaxis.categories[index],
        y: value
    }));
    console.log('series', series.value);
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = programs.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
