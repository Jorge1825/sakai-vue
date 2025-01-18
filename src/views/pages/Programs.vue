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
                <Column field="category" header="CATEGORÍA" style="width: 20%" />
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
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editProgram(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del programa: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Categoría:</strong> {{ slotProps.data.category }}</p>
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
                                <!--                                 <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Categoría requerida']" v-model="program.category" label="Categoría" required style="padding: 10px" autogrow />
                                </div> -->
                                <div class="col-6">
                                    <q-select v-model="program.category" :options="categories" label="Categoría" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="program.status" :options="status" label="Estado" required style="padding: 10px" />
                                </div>
                            </div>
                        </q-card-section>

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
import { createProgramApi, editProgramApi, getProgramApi, toggleActiveProgramApi } from '@/api/programs';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const programs = ref([]);
const programDialog = ref(false);
const program = ref({
    id: null,
    name: '',
    description: '',
    category: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

const categories = ref([
    { label: 'Categoría 1', value: 'Categoría 1' },
    { label: 'Categoría 2', value: 'Categoría 2' },
    { label: 'Categoría 3', value: 'Categoría 3' }
]);

onBeforeMount(async () => {
    await getProgram();
});

async function getProgram() {
    try {
        const { data } = await getProgramApi();
        console.log(data);
        programs.value = data.length ? data : [];

        console.log(programs.value);
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
        category: '',
        status: status.value[0]
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
            category: program.value.category,
            status: program.value.status.value
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
            category: program.value.category,
            status: program.value.status.value
        };

        const response = await createProgramApi(programApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Programa creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getProgram();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el programa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editProgram(selectedProgram) {
    program.value = { ...selectedProgram };
    program.value.status = status.value.find((s) => s.value === selectedProgram.status);
    programDialog.value = true;
    console.log(program.value);
}

//funcion activar desactivar programa
async function toggleStatus(selectedProgram) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveProgramApi(selectedProgram._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedProgram.status = selectedProgram.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Programa ${selectedProgram.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedProgram.status === 'Activo' ? 'blue' : 'rgb(242, 185, 179)', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getProgram();
        } else {
            throw new Error('Error al actualizar el estado de la programa.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la programa.',
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
