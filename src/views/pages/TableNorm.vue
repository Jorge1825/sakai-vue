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
    <q-dialog v-model="requiDialog"  width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ requi._id ? 'EDITAR NORMA' : 'NUEVA NORMA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-xs">
                              <div class="col-12">
                                    <q-select v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => (val) || 'Norma requerida']" />
                                </div>
                                <div class="col-6 justify-center flex items-center">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn :disabled="!norm" class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                                <div class="col-6 justify-center flex items-center">
                                    <q-btn class="q-mx-sm flex" outline label="Carga Manual" color="primary"/>
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

    <q-dialog v-model="responseIADialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveNorm" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ requi._id ? 'EDITAR NORMA' : 'NUEVA NORMA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-xs">
                                <div class="col-12">
                                    <q-select v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma requerida']" />
                                </div>
                                <div class="col-6 justify-center flex items-center ">
                                    <input type="file" id="inputFile" @change="selectFile" style="display: none" />
                                    <q-btn class="q-mx-sm flex" filled label="Cargar Archivo" color="primary" @click="uploadFile" />
                                </div>
                                <div class="col-6 q-py-lg">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del rol requerido']" v-model="requi.name" label="Nombre del Rol" required style="padding: 10px" />
                                </div>
                                <div class="col-6 q-py-lg">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="requi.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="requi.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { getNormsApi } from '@/api/norms';
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
const responseIADialog = ref(false);
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

onBeforeMount(async () => {
    await getRoles();
    await getNorms()
});

// Función que dispara el click en el input de archivo
const uploadFile = () => {
    const input = document.getElementById('inputFile');
    input.click();
};

// Función que maneja la selección del archivo
const selectFile = (event) => {
    file.value = event.target.files[0];
    console.log('Archivo seleccionado:', archivoSeleccionado.value);
};

async function getRoles() {
    try {
        const { data } = await getRolesApi();
        console.log(data);
        requis.value = data.length ? data : [];

        console.log(requis.value);
    } catch (error) {
        console.error(error);
    }
}
async function getNorms() {
    try {
        const { data } = await getNormsApi();
        console.log(data);
        norms.value = data.length ? data?.map((r) => ({ label: r.name, value: r._id })) : [];

        console.log(norms.value);
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

function uploadFileServer() {
    const formData = new FormData();

    formData.append('file', file.value);
}
// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = requis.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
