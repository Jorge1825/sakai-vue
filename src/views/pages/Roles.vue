<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: #1976d2; text-transform: uppercase">
                        <strong>Roles</strong>
                    </div>
                </div>
                <div :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" class="col-12 flex justify-end">
                    <q-btn icon="add" color="blue" @click="openDialog" class="q-mr-sm" />
                    <q-btn icon="expand_more" color="blue" @click="expandAll" class="q-mr-sm" />
                    <q-btn icon="expand_less" color="red" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de usuarios -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="roles"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 15%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 35%" />
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
                            <!-- Modifique el boton para que llame al metodo toggleStatus-->
                            <q-btn :icon="slotProps.data.status === true ? 'clear' : 'check'" :color="slotProps.data.status === true ? 'red' : 'blue'" @click="toggleStatus(slotProps.data)" dense round class="q-mr-xs" />
                            <q-btn icon="edit" color="blue" @click="editRole(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Rol: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
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

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="roleDialog" persistent width="800px">
    <div class="container bg-white">
        <div class="watermark-container justify-center flex">
            <q-card class="justify-center flex bg-transparent">
                <q-form @submit.prevent.stop="saveRole" novalidate class="q-pa-md">
                    <q-card-section>
                        <div class="text-h6 text-center" style="font-weight: bold; font-size: 24px; color: #1976d2">
                            AGREGAR ROL
                        </div>
                    </q-card-section>

                    <q-card-section>
                        <div class="row">
                            <div class="col-6">
                                <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del rol requerido']" v-model="role.name" label="Nombre del Rol" required style="padding: 10px" />
                            </div>
                            <div class="col-6">
                                <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="role.description" label="Descripción" required style="padding: 10px" autogrow />
                            </div>
                            <div class="col-6">
                                <q-select v-model="role.status" :options="status" label="Estado" required style="padding: 10px" />
                            </div>
                        </div>
                    </q-card-section>

                    <q-card-actions align="right">
                        <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog" />
                        <q-btn class="q-mx-sm" outline label="Guardar" color="blue" type="submit" />
                    </q-card-actions>
                </q-form>
            </q-card>
            <div class="watermark"></div>
        </div>
    </div>
</q-dialog>

</template>

<script setup>
import { createRoleApi, editRoleApi, getRolesApi, toggleActiveRoleApi } from '@/api/roles';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const roles = ref([]);
const roleDialog = ref(false);
const role = ref({
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

onBeforeMount(async () => {
    await getRoles();
});

async function getRoles() {
    try {
        const { data } = await getRolesApi();
        console.log(data);
        roles.value = data.length ? data : [];

        console.log(roles.value);
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    role.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        status: status.value[0]
    };
    roleDialog.value = true;
}

function hideDialog() {
    roleDialog.value = false;
}

async function saveRole() {
    console.log(role.value);

    if (role.value._id) {
        const roleApi = {
            id: role.value._id,
            name: role.value.name,
            description: role.value.description,
            status: role.value.status.value
        };

        const response = await editRoleApi(roleApi);

        if (response.status === 200) {
            Notify.create({ message: 'Rol actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getRoles();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el rl.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const roleApi = {
            name: role.value.name,
            description: role.value.description,
            status: role.value.status.value
        };

        const response = await createRoleApi(roleApi);
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
    role.value = { ...selectedRole };
    role.value.status = status.value.find((s) => s.value === selectedRole.status);
    roleDialog.value = true;
    console.log(role.value);
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
                message: `Usuario ${selectedRole.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedRole.status === 'Activo' ? 'blue' : 'red',
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getRoles();
        } else {
            throw new Error('Error al actualizar el estado del usuario.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado del usuario.',
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
    expandedRows.value = roles.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
