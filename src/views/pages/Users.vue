<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: #1976d2; text-transform: uppercase">
                        <strong>Usuarios</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <q-btn icon="add" color="blue" @click="openDialog" class="q-mr-sm" />
                    <q-btn icon="expand_more" color="blue" @click="expandAll" class="q-mr-sm" />
                    <q-btn icon="expand_less" color="red" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de usuarios -->
            <DataTable v-model:expandedRows="expandedRows" :value="users" dataKey="id" responsiveLayout="scroll" paginator rows="10">
                <Column field="id" header="ID" style="width: 5%" />
                <Column field="username" header="NOMBRE DE USUARIO" style="width: 20%" />
                <Column field="email" header="EMAIL" :sortable="true" style="width: 30%" />
                <Column field="phone" header="TELÉFONO" :sortable="true" style="width: 15%" />
                <Column field="role" header="ROL" :sortable="true" style="width: 10%" />
                <Column field="status" header="ESTADO" style="width: 10%; text-align: left; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            <q-badge :color="slotProps.data.status === 'Activo' ? 'blue' : 'red'" class="q-ml-xs">
                                {{ slotProps.data.status }}
                            </q-badge>
                        </div>
                    </template>
                </Column>
                <Column field="subscription" header="Suscripción" style="width: 10%; text-align: center; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: center">
                            <q-badge :color="slotProps.data.subscription === 'Suscrito' ? 'blue' : 'grey'" class="q-ml-xs">
                                {{ slotProps.data.subscription }}
                            </q-badge>
                        </div>
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <q-btn :icon="slotProps.data.status === 'Activo' ? 'clear' : 'check'" :color="slotProps.data.status === 'Activo' ? 'red' : 'blue'" @click="toggleStatus(slotProps.data)" dense round class="q-mr-xs" />
                            <q-btn icon="edit" color="blue" @click="editUser(slotProps.data)" dense round />
                            <!-- <q-btn icon="delete" color="negative" @click="deleteUser(slotProps.data)" dense /> -->
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Usuario: {{ slotProps.data.username }}</h5>
                        <p><strong>Email:</strong> {{ slotProps.data.email }}</p>
                        <p><strong>Teléfono:</strong> {{ slotProps.data.phone }}</p>
                        <p><strong>Rol:</strong> {{ slotProps.data.role }}</p>
                        <p>
                            <strong>Estado:</strong>
                            <q-badge :color="slotProps.data.status === 'Activo' ? 'blue' : 'red'">
                                {{ slotProps.data.status }}
                            </q-badge>
                        </p>
                        <p>
                            <strong>Suscripción:</strong>
                            <q-badge :color="slotProps.data.subscription === 'Suscrito' ? 'blue' : 'grey'">
                                {{ slotProps.data.subscription }}
                            </q-badge>
                        </p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="userDialog" persistent width="800px">
        <q-card>
            <q-form @submit.prevent.stop="saveUser" novalidate>
                <q-card-section>
                    <div class="text-h6 text-center" style="font-weight: bold; font-size: 24px; color: #1976d2">AGREGAR USUARIO</div>
                </q-card-section>

                <q-card-section>
                    <div class="row ">
                        <div class="col-6">
                            <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre de usuario requerido']" v-model="user.username" label="Nombre de Usuario" required style="padding: 10px" />
                        </div>
                        <div class="col-6">
                            <q-input v-model="user.email" label="Email" required style="padding: 10px" />
                        </div>
                        <div class="col-6">
                            <q-input v-model="user.phone" label="Teléfono" type="number" required style="padding: 10px" />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.role" :options="roles" label="Rol" required style="padding: 10px" />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.status" :options="status" label="Estado" required style="padding: 10px" />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.subscription" :options="['Suscrito', 'No Suscrito']" label="Suscripción" required style="padding: 10px" />
                        </div>

                        <div class="col-6">
                            <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'password requerida']" v-model="user.password" label="Contraseña" required style="padding: 10px" />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancelar" color="negative" @click="hideDialog" />
                    <q-btn flat label="Guardar" color="blue" type="submit" />
                </q-card-actions>
            </q-form>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { getUsersApi, editUserApi} from '@/api/users';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const users = ref([]);
const userDialog = ref(false);
const user = ref({});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

const roles = ref([
    { label: 'ADMIN', value: 'ADMIN' },
    { label: 'USER', value: 'USER' }
]);

const exampleUsers = [
    { id: 1, username: 'Jeferson1', email: 'Jeferson1@gmail.com', phone: '1234567890', role: 'Admin', status: 'Activo', subscription: 'Suscrito' },
    { id: 2, username: 'Jeferson2', email: 'Jeferson2@gmail.com', phone: '1234567891', role: 'User', status: 'Inactivo', subscription: 'No Suscrito' },
    { id: 3, username: 'Jeferson3', email: 'Jeferson3@gmail.com', phone: '1234567892', role: 'User', status: 'Activo', subscription: 'Suscrito' }
];

onBeforeMount(async () => {
   await getUsers();
});

async function getUsers() {
    try {
        const { data } = await getUsersApi();
        users.value = data.length ? data : exampleUsers;
    } catch (error) {
        console.error(error);
        users.value = exampleUsers;
    }
}

function openDialog() {
    user.value = { id: null, username: '', email: '', phone: '', role: 'User', status: 'Activo', subscription: 'No Suscrito' };
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
}

async function saveUser() {
    if (!validateUser()) return;

    console.log(user.value);

    if (user.value._id) {

        const userApi = {
            id: user.value._id,
            username: user.value.username,
            email: user.value.email,
            phone: user.value.phone,
            role: user.value.role.value,
            status: user.value.status.value,
            password: user.value.password
        }

        const response = await editUserApi(userApi)
        console.log(response)

        if (response.status === 200) {
            Notify.create({ message: 'Usuario actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getUsers()
            hideDialog();
        }else{
            Notify.create({ message: 'Error al actualizar el usuario.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        user.value.id = Math.max(...users.value.map((u) => u.id), 0) + 1;
        users.value.push({ ...user.value });
        Notify.create({ message: 'Usuario agregado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
    }
   
}

function validateUser() {
    const usernameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!usernameRegex.test(user.value.username)) {
        Notify.create({
            message: 'El nombre de usuario no debe contener caracteres especiales.',
            color: 'red',
            textColor: 'white',
            position: 'top',
            classes: 'my-notification'
        });
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(user.value.email)) {
        Notify.create({
            message: 'El email no es válido.',
            color: 'red',
            textColor: 'white',
            position: 'top',
            classes: 'my-notification'
        });
        return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(user.value.phone)) {
        Notify.create({
            message: 'El teléfono debe contener 10 dígitos.',
            color: 'red',
            textColor: 'white',
            position: 'top',
            classes: 'my-notification'
        });
        return false;
    }

    return true;
}

function editUser(selectedUser) {
    user.value = { ...selectedUser };
    user.value.role = roles.value.find((r) => r.value === selectedUser.role);
    user.value.status = status.value.find((s) => s.value === selectedUser.status);
    userDialog.value = true;
    console.log(user.value);
    
}

// Eliminar
// function deleteUser(selectedUser) {
//     const index = users.value.findIndex(u => u.id === selectedUser.id);
//     if (index !== -1) {
//         users.value.splice(index, 1);
//         Notify.create({ message: 'Usuario eliminado correctamente.', position: 'top', textColor: 'white', color: 'red', multiLine: true });
//     }
// }

function toggleStatus(selectedUser) {
    selectedUser.status = selectedUser.status === 'Activo' ? 'Inactivo' : 'Activo';
    Notify.create({
        message: `Usuario ${selectedUser.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
        type: selectedUser.status === 'Activo' ? 'positive' : 'negative',
        position: 'top',
        textColor: 'white',
        color: selectedUser.status === 'Activo' ? 'blue' : 'red',
        multiLine: true
    });
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = users.value.map((user) => user.id);
}

function collapseAll() {
    expandedRows.value = [];
}
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px; /* Espacio entre los botones */
}
</style>
