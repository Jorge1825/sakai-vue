<script setup>
import { getUsers } from '@/api/users';
import { onBeforeMount, ref } from 'vue';
import { Notify } from 'quasar';

const users = ref([]);
const userDialog = ref(false);
const user = ref({});
const expandedRows = ref([]);

// Datos de ejemplo
const exampleUsers = [
    { id: 1, username: 'Jeferson1', email: 'Jeferson1@gmail.com', phone: '1234567890', role: 'Admin', status: 'Activo', subscription: 'Suscrito' },
    { id: 2, username: 'Jeferson2', email: 'Jeferson2@gmail.com', phone: '1234567891', role: 'User', status: 'Inactivo', subscription: 'No Suscrito' },
    { id: 3, username: 'Jeferson3', email: 'Jeferson3@gmail.com', phone: '1234567892', role: 'User', status: 'Activo', subscription: 'Suscrito' },
];

onBeforeMount(async () => {
    try {
        const { data } = await getUsers();
        users.value = data.length ? data : exampleUsers; // Usar datos de ejemplo si no hay datos
    } catch (error) {
        console.error(error);
        users.value = exampleUsers; // Usar datos de ejemplo en caso de error
    }
});

function openDialog() {
    user.value = { id: null, username: '', email: '', phone: '', role: 'User', status: 'Activo', subscription: 'No Suscrito' };
    userDialog.value = true;
}

function hideDialog() {
    userDialog.value = false;
}

function saveUser() {
    if (!validateUser()) return; // Detener si la validación falla

    if (user.value.id) {
        const index = users.value.findIndex(u => u.id === user.value.id);
        if (index !== -1) {
            users.value[index] = { ...user.value };
            Notify.create('Usuario actualizado correctamente.');
        }
    } else {
        user.value.id = Math.max(...users.value.map(u => u.id), 0) + 1;
        users.value.push({ ...user.value });
        Notify.create('Usuario agregado correctamente.');
    }
    hideDialog();
}

function validateUser() {
    const usernameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!usernameRegex.test(user.value.username)) {
        Notify.create('El nombre de usuario no debe contener caracteres especiales.');
        return false;
    }

    // Validación del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.value.email)) {
        Notify.create('El email debe ser válido.');
        return false;
    }

    // Validación del teléfono
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(user.value.phone)) {
        Notify.create('El número de teléfono debe ser de 10 dígitos.');
        return false;
    }

    return true;
}

function editUser(userToEdit) {
    user.value = { ...userToEdit };
    userDialog.value = true;
}

function deleteUser(userToDelete) {
    users.value = users.value.filter(u => u.id !== userToDelete.id);
    Notify.create('Usuario eliminado correctamente.');
}

function toggleStatus(user) {
    user.status = user.status === 'Activo' ? 'Inactivo' : 'Activo';
}

function expandAll() {
    expandedRows.value = [...users.value];
}

function collapseAll() {
    expandedRows.value = [];
}
</script>

<template>
    <div class="col-span-12">
        <div class="q-my-md row">
            <div class="col-6 font-semibold text-xl">Usuarios</div>
            <div class="col-6 justify-end flex">
                <q-btn label="Agregar" icon="add" color="blue" class="mr-2" @click="openDialog" />
            </div>
        </div>

        <div class="card full-height" style="min-height: 82vh;">
            <div class="flex justify-end gap-2 mb-2">
                <q-btn label="Expandir Todo" icon="expand_more" color="blue" @click="expandAll" />
                <q-btn label="Colapsar Todo" icon="expand_less" color="red" @click="collapseAll" />
            </div>

            <DataTable v-model:expandedRows="expandedRows" :value="users" dataKey="id" responsiveLayout="scroll"
                paginator rows="10">
                <Column field="id" header="ID" style="width: 5%" />
                <Column field="username" header="Nombre de Usuario" style="width: 20%" />
                <Column field="email" header="Email" :sortable="true" style="width: 30%" />
                <Column field="phone" header="Teléfono" :sortable="true" style="width: 15%" />
                <Column field="role" header="Rol" :sortable="true" style="width: 10%" />
                <Column field="status" header="Estado" style="width: 10%">
                    <template #body="slotProps">
                        <q-badge :color="slotProps.data.status === 'Activo' ? 'blue' : 'red'" class="q-ml-xs">
                            {{ slotProps.data.status }}
                        </q-badge>
                    </template>
                </Column>
                <Column field="subscription" header="Suscripción" style="width: 10%">
                    <template #body="slotProps">
                        <q-badge :color="slotProps.data.subscription === 'Suscrito' ? 'blue' : 'grey'" class="q-ml-xs">
                            {{ slotProps.data.subscription }}
                        </q-badge>
                    </template>
                </Column>
                <Column header="Acciones" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <q-btn 
                                :label="slotProps.data.status === 'Activo' ? 'Desactivar' : 'Activar'"
                                :color="slotProps.data.status === 'Activo' ? 'red' : 'blue'"
                                @click="toggleStatus(slotProps.data)" 
                                class="action-button" 
                                dense 
                            />
                            <q-btn 
                                label="Editar" 
                                icon="edit" 
                                color="blue" 
                                @click="editUser(slotProps.data)"
                                class="action-button" 
                                dense 
                            />
                            <q-btn 
                                label="Eliminar" 
                                icon="delete" 
                                color="negative" 
                                @click="deleteUser(slotProps.data)"
                                class="action-button" 
                                dense 
                            />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Usuario: {{ slotProps.data.username }}</h5>
                        <p><strong>Email:</strong> {{ slotProps.data.email }}</p>
                        <p><strong>Teléfono:</strong> {{ slotProps.data.phone }}</p>
                        <p><strong>Rol:</strong> {{ slotProps.data.role }}</p>
                        <p><strong>Estado:</strong> <q-badge
                                :color="slotProps.data.status === 'Activo' ? 'blue' : 'red'">{{ slotProps.data.status
                                }}</q-badge></p>
                        <p><strong>Suscripción:</strong> <q-badge
                                :color="slotProps.data.subscription === 'Suscrito' ? 'blue' : 'grey'">{{
                                    slotProps.data.subscription }}</q-badge></p>
                    </div>
                </template>
            </DataTable>
        </div>

        <q-dialog v-model="userDialog" persistent width="800px">
            <q-card>
                <q-card-section>
                    <div class="text-h6 text-center" style="font-weight: bold; font-size: 24px; color: #1976d2;">
                        AGREGAR USUARIO
                    </div>
                </q-card-section>

                <q-card-section>
                    <div class="row">
                        <div class="col-6">
                            <q-input v-model="user.username" label="Nombre de Usuario" required />
                        </div>
                        <div class="col-6">
                            <q-input v-model="user.email" label="Email" required />
                        </div>
                        <div class="col-6">
                            <q-input v-model="user.phone" label="Teléfono" type="number" required />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.role" :options="['Admin', 'User']" label="Rol" />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.status" :options="['Activo', 'Inactivo']" label="Estado" />
                        </div>
                        <div class="col-6">
                            <q-select v-model="user.subscription" :options="['Suscrito', 'No Suscrito']"
                                label="Estado de Suscripción" />
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions>
                    <q-btn label="Cancelar" color="grey" @click="hideDialog" />
                    <q-btn label="Guardar" color="primary" @click="saveUser" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
</template>
<style scoped>
.button-group {
    display: flex;
    flex-direction: row;
    gap: 10px; /* Espacio entre los botones */
}

.action-button {
    min-width: 100px; /* Tamaño fijo para los botones */
}
</style>