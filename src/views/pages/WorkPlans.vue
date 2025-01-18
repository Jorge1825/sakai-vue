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
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />

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
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 20%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 20%" />
                <Column field="norm" header="NORMA" style="width: 20%" />
                <Column field="pendingRequirementsCount" header="CANTIDAD DE REQUISITOS PENDIENTES" style="width: 15%" />
                <Column field="generationDate" header="FECHA DE GENERACIÓN" style="width: 10%" />
                <Column field="status" header="ESTADO" style="width: 10%; text-align: left; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            <q-badge :color="slotProps.data.status === true ? 'blue' : 'rgb(242, 185, 179)'" class="q-ml-xs">
                                {{ status.find((s) => s.value === slotProps.data.status).label }}
                            </q-badge>
                        </div>
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->
                            <q-btn
                                :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'rgb(242, 185, 179)' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleStatus(slotProps.data)"
                                dense
                                round
                                class="q-mr-xs"
                            />
                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editWorkPlan(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del plan de trabajo: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Cantidad de requisitos pendientes:</strong> {{ slotProps.data.pendingRequirementsCount }}</p>
                        <p><strong>Fecha de generación:</strong> {{ formatDate(slotProps.data.generationDate) }}</p>
                        <p>
                            <strong>Estado:</strong>
                            <q-badge :color="slotProps.data.status === true ? 'blue' : 'rgb(242, 185, 179)'">
                                {{ status.find((s) => s.value === slotProps.data.status).label }}
                            </q-badge>
                        </p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar plan de trabajo -->
    <q-dialog v-model="workPlanDialog" persistent>
        <div class="container bg-white" style="width: 800px; max-width: 80vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveWorkPlan" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">RESOLUCIÓN 0312</div>
                        </q-card-section>
                        <!-- [ -->
                        <!-- {
      quantity: 11,
      idRequirement: '675967435f09f3a852efe10a',
      nameRequirement: 'RECURSOS',
      numberRequirement: '1',
      norm: 'RESOLUCIÓN 0312',
      normId: '6724ccc736a2e8c68d2c27fa',
      items: [
        {
          quantity: 8,
          reqChild: {
            id: '6755cc2421306b1a0f73c054',
            number: '1.1',
            description: 
              'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
            title: 'Recursos para el SG-SST'
          },
          items: Array(8) [
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 
                'Responsable del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 
                'Responsabilidades en el Sistema de Gestión de Seguridad y Salud en el Trabajo – SG-SST',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 
                'Asignación de recursos para el Sistema de Gestión en Seguridad y Salud en el Trabajo – SG-SST',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 'Afiliación al Sistema General de Riesgos Laborales',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 'Pago de pensión trabajadores alto riesgo',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
            {
              reqChild: {
                id: '6755cc2421306b1a0f73c054',
                number: '1.1',
                description: 
                  'Recursos financieros, técnicos,  humanos y de otra índole requeridos para coordinar y desarrollar el Sistema de Gestión de la Seguridad y la Salud en el Trabajo (SG-SST) (4%)',
                title: 'Recursos para el SG-SST'
              },
              norm: 'RESOLUCIÓN 0312',
              normId: '6724ccc736a2e8c68d2c27fa',
              nameRequirement: 'RECURSOS',
              numberRequirement: '1',
              idRequirement: '675967435f09f3a852efe10a',
              item: 'Conformación COPASST / Vigía',
              value: '0.5',
              percentageWeight: '0.5',
              fullyComplies: 0,
              doesNotComply: 0,
              justifies: 0,
              doesNotJustify: 0
            },
                               -->
                        <table class="full-width table-work">
                            <thead>
                                <tr>
                                    <th class="text-left">Item</th>
                                    <th class="text-left">Criterios de la empresa</th>
                                    <th class="text-left">Plan de acción (Actividades)</th>
                                    <th class="text-left">Responsable</th>
                                    <th class="text-left">Fechas de cumplimiento</th>
                                    <th class="text-left">Recursos</th>
                                    <th class="text-left">Soportes sugeridos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>E1.1.1 Asignación de persona que diseñe e implemente el Sistema de Gestión de SST (4%)</td>
                                    <td>
                                        Esta actividad podrá ser realizada profesionales en SST y profesionales con posgrado en SST, que cuenten con licencia vigente en Seguridad y Salud en el Trabajo vigente y el curso de capacitación virtual de
                                        cincuenta (50) horas.
                                    </td>
                                    <td>
                                        <ul>
                                            <li>Realizar el diseño del Sistema de Gestión de SST.</li>
                                            <li>Implementar el Sistema de Gestión de SST.</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>Responsable del Sistema de Gestión de Seguridad y Salud en el Trabajo SG-SST.</li>
                                            <li>Responsabilidades en el Sistema de Gestión de Seguridad y Salud en el Trabajo – SG-SST.</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>01-01-2025 - año fiscal</li>
                                            <li>01-01-2025 - año fiscal</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>Administrativos y financieros</li>
                                            <li>Administrativos y financieros</li>
                                        </ul>
                                    </td>
                                    <td>
                                        <ul>
                                            <li>Evidencias de competencias y certificados de aprobación del curso de 50 y 20 horas.</li>
                                            <li>Evidencias de competencias y certificados de aprobación del curso de 50 y 20 horas.</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>E1.1.2 Asignación de persona que diseñe e implemente el Sistema de Gestión de SST (4%)</td>
                                    <td>Mantener a disposición de la Entidad que lo requiera la documentación que soporte el perfil de la persona que se encargó de realizar el diseño del SGSST.</td>
                                    <td>VZH</td>
                                    <td>01-01-2025 - año fiscal</td>
                                    <td>Administrativos y financieros</td>
                                    <td>Evidencias de competencias y certificados de aprobación del curso de 50 y 20 horas.</td>
                                </tr>
                            </tbody>
                        </table>

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
import { createWorkPlanApi, editWorkPlanApi, getWorkPlanApi, toggleActiveWorkPlanApi } from '@/api/worksPlans.js'; //ROLES
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const workPlans = ref([]);
const workPlanDialog = ref(true);
const workPlan = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    generationDate: '',
    pendingRequirementsCount: 0,
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

onBeforeMount(async () => {
    await getWorkPlan();
});

async function getWorkPlan() {
    try {
        const { data } = await getWorkPlanApi();
        console.log(data);
        workPlans.value = data.length ? data : [];

        console.log(workPlans.value);
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    workPlan.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norm: '',
        generationDate: '',
        pendingRequirementsCount: 0,
        status: status.value[0]
    };
    workPlanDialog.value = true;
}

function hideDialog() {
    workPlanDialog.value = false;
}

async function saveWorkPlan() {
    console.log(workPlan.value);

    if (workPlan.value._id) {
        const workPlanApi = {
            id: workPlan.value._id,
            name: workPlan.value.name,
            description: workPlan.value.description,
            norm: workPlan.value.norm,
            generationDate: workPlan.value.generationDate,
            pendingRequirementsCount: workPlan.value.pendingRequirementsCount,
            status: workPlan.value.status.value
        };

        const response = await editWorkPlanApi(workPlanApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Plan de trabajo actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getWorkPlan();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el plan de trabajo.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const workPlanApi = {
            name: workPlan.value.name,
            description: workPlan.value.description,
            norm: workPlan.value.norm,
            generationDate: workPlan.value.generationDate,
            pendingRequirementsCount: workPlan.value.pendingRequirementsCount,
            status: workPlan.value.status.value
        };

        const response = await createWorkPlanApi(workPlanApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Plan de trabajo creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getWorkPlan();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el plan de trabajo.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editWorkPlan(selectedWorkPlan) {
    workPlan.value = { ...selectedWorkPlan };
    workPlan.value.status = status.value.find((s) => s.value === selectedWorkPlan.status);
    workPlanDialog.value = true;
    console.log(workPlan.value);
}

//funcion activar desactivavr usuario
async function toggleStatus(selectedWorkPlan) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveWorkPlanApi(selectedWorkPlan._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedWorkPlan.status = selectedWorkPlan.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Plan de trabajo ${selectedWorkPlan.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedWorkPlan.status === 'Activo' ? 'blue' : 'rgb(242, 185, 179)', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getWorkPlan();
        } else {
            throw new Error('Error al actualizar el estado del plan de trabajo.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la actvidad.',
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
    expandedRows.value = workPlans.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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

.table-work {
    /*  
    auto scrolll
    */

    overflow: auto;
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

ul {
    /* border: 0.1px solid rgb(142, 142, 142); */
    padding: 0;
    list-style: none;
    border-spacing: 10px; /* Espaciado entre los elementos */
}

li {
    border: 0.1px solid rgb(142, 142, 142);
    padding: 10px; /* Espaciado interno de los elementos */
    margin-bottom: 15px;
}
</style>
