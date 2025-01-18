<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>EMPRESAS</strong>
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

            <!-- Tabla de empresas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="enterprises"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" />
                <Column field="nit" header="NIT" :sortable="true" style="width: 10%" />
                <Column field="address" header="DIRECCIÓN " :sortable="true" style="width: 10%" />
                <Column field="phone" header="TELÉFONO" :sortable="true" style="width: 10%" />
                <Column field="email" header="CORREO" :sortable="true" style="width: 10%" />
                <Column field="riskLevel" header="CLASE DE RIESGO" style="width: 10%">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            {{ riskLevels.find((r) => r.value === slotProps.data.riskLevel).label }}
                        </div>
                    </template>
                </Column>
                <!--<Column field="nit" header="DESCRIPCIÓN" style="width: 35%" />-->
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

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editEnterprise(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles de la empresa {{ slotProps.data.name }}</h5>
                        <p><strong>Nit:</strong> {{ slotProps.data.nit }}</p>
                        <p><strong>Dirección:</strong> {{ slotProps.data.address }}</p>
                        <p><strong>Teléfono:</strong> {{ slotProps.data.phone }}</p>
                        <p><strong>Correo:</strong> {{ slotProps.data.email }}</p>
                        <p><strong>Clase de riesgo:</strong> {{ riskLevels.find((r) => r.value === slotProps.data.riskLevel).label }}</p>
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

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="enterpriseDialog" persistent>
        <div class="container bg-white" style="width: 700px; max-width: 80vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveEnterprise" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ enterprises._id ? 'EDITAR EMPRESA' : 'NUEVA EMPRESA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del la empresa requerido']" v-model="enterprise.name" label="Nombre de la empresa" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nit requerido']" v-model="enterprise.nit" label="Nit" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Dirección requerida']" v-model="enterprise.address" label="Dirección" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input
                                        lazy-rules
                                        v-model="enterprise.phone"
                                        label="Teléfono"
                                        type="number"
                                        required
                                        style="padding: 10px"
                                        :rules="[(val) => (val && val?.toString().length > 0) || 'Teléfono requerido', (val) => (val && val?.toString().length === 10) || 'Teléfono inválido']"
                                    />
                                </div>

                                <div class="col-6">
                                    <q-input
                                        lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Correo electrónico requerido', (val) => /.+@.+\..+/.test(val) || 'Correo electrónico inválido']"
                                        v-model="enterprise.email"
                                        label="Correo"
                                        type="email"
                                        required
                                        style="padding: 10px"
                                        autogrow
                                    />
                                </div>

                                <div class="col-6">
                                    <q-select v-model="enterprise.riskLevel" :options="riskLevels" label="Clase de Riesgo" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input
                                        lazy-rules
                                        v-model="enterprise.numberEmployees"
                                        label="Número de empleados"
                                        type="number"
                                        required
                                        style="padding: 10px"
                                        :rules="[(val) => (val && val?.toString().length > 0) || 'Número de empleados requerido']"
                                    />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="enterprise.status" :options="status" label="Estado" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-select use-chips multiple stack-label v-model="enterprise.norms" :options="norms" label="Normas activas" required style="padding: 10px" />
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
import { createEnterpriseApi, editEnterpriseApi, getEnterprisesApi } from '@/api/enterprises';
import { getNormsApi } from '@/api/norms';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const enterprises = ref([]);
const enterpriseDialog = ref(false);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const riskLevels = ref([
    { label: 'I', value: 1 },
    { label: 'II', value: 2 },
    { label: 'III', value: 3 },
    { label: 'IV', value: 4 },
    { label: 'V', value: 5 }
]);
const enterprise = ref({
    id: null,
    name: '',
    nit: '',
    address: '',
    numberEmployees: '',
    email: '',
    phone: '',
    riskLevel: riskLevels.value[0],
    status: status.value[0],
    norms: []
});
const expandedRows = ref([]);
const norms = ref([]);

onBeforeMount(async () => {
    await getNorms();
    await getEnterprises();
});

async function getEnterprises() {
    try {
        const { data } = await getEnterprisesApi();
        console.log(data);
        enterprises.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

async function getNorms() {
    try {
        const { data } = await getNormsApi();
        console.log(data);
        norms.value = data.length ? data?.map((norm) => ({ label: norm.name, value: norm._id })) : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    enterprise.value = {
        id: null,
        name: '',
        nit: '',
        address: '',
        email: '',
        phone: '',
        riskLevel: riskLevels.value[0],
        status: status.value[0],
        norms: [],
        numberEmployees: ''
    };
    enterpriseDialog.value = true;
}

function hideDialog() {
    enterpriseDialog.value = false;
}

async function saveEnterprise() {
    console.log(enterprise.value);

    if (enterprise.value._id) {
        const enterpriseApi = {
            id: enterprise.value._id,
            name: enterprise.value.name,
            nit: enterprise.value.nit,
            address: enterprise.value.address,
            email: enterprise.value.email,
            phone: enterprise.value.phone,
            riskLevel: enterprise.value.riskLevel.value,
            status: enterprise.value.status.value,
            norms: enterprise.value.norms?.map((norm) => norm.value),
            numberEmployees: enterprise.value.numberEmployees
        };

        const response = await editEnterpriseApi(enterpriseApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Empresa actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getEnterprises();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar la empresa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const enterpriseApi = {
            id: enterprise.value._id,
            name: enterprise.value.name,
            nit: enterprise.value.nit,
            address: enterprise.value.address,
            email: enterprise.value.email,
            phone: enterprise.value.phone,
            status: enterprise.value.status.value,
            riskLevel: enterprise.value.riskLevel.value,
            norms: enterprise.value.norms?.map((norm) => norm.value),
            numberEmployees: enterprise.value.numberEmployees
        };

        const response = await createEnterpriseApi(enterpriseApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Calificacion creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getEnterprises();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el calificacion.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editEnterprise(selectedEnterprise) {
    enterprise.value = { ...selectedEnterprise };
    enterprise.value.riskLevel = riskLevels.value.find((r) => r.value === selectedEnterprise.riskLevel);
    enterprise.value.status = status.value.find((s) => s.value === selectedEnterprise.status);
    enterprise.value.numberEmployees = selectedEnterprise.numberEmployees;
    enterprise.value.norms = [];

    selectedEnterprise.norms.forEach((norm) => {
        const findNorm = norms.value.find((n) => n.value === norm._id);
        if (findNorm) {
            enterprise.value.norms.push({
                label: findNorm.label,
                value: findNorm.value
            });
        }
    });

    enterpriseDialog.value = true;
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = enterprises.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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
