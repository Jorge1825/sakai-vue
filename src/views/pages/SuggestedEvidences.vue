<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>SUGERENCIA DE EVIDENCIAS</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="suggestedEvidences"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 20%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 50%" />
                <Column field="status" header="ESTADO" style="width: 10%; text-align: left; text-transform: uppercase">
                    <template #body="slotProps">
                        <div style="text-align: left">
                            <q-badge :color="slotProps.data.status === true ? 'blue' : 'rgb(242, 185, 179)'" class="q-ml-xs">
                                {{ status.find((s) => s.value === slotProps.data.status).label }}
                            </q-badge>
                        </div>
                    </template>
                </Column>
                <Column header="ACCIONES" style="width: 10%; text-align: center">
                    <template #body="slotProps">
                        <div class="button-group" style="text-align: center">
                            <q-btn
                                :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'rgb(242, 185, 179)' : 'rgb(4, 178, 217)', color: 'white' }"
                                @click="toggleStatus(slotProps.data)"
                                dense
                                round
                                class="q-mr-xs"
                            />
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editSuggestedEvidence(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles de sugerencias de evidencias: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
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

    <q-dialog v-model="suggestedEvidenceDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveSuggestedEvidence" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ suggestedEvidence._id ? 'EDITAR SUGERENCIA DE EVIDENCIAS' : 'NUEVA SUGERENCIA DE EVIDENCIA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input
                                        lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Nombre del sugerencia de evidencia es requerido']"
                                        v-model="suggestedEvidence.name"
                                        label="Nombre del sugerencia de evidencias"
                                        required
                                        style="padding: 10px"
                                    />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="suggestedEvidence.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-12">
                                    <q-select v-model="suggestedEvidence.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { createSuggestedEvidenceApi, editSuggestedEvidenceApi, getNormDetailsApi, getSuggestedEvidenceApi, toggleActiveSuggestedEvidenceApi } from '@/api/suggestedEvidences';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const suggestedEvidences = ref([]);
const suggestedEvidenceDialog = ref(false);
const suggestedEvidence = ref({
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

const categories = ref([
    { label: 'Categoría 1', value: 'Categoría 1' },
    { label: 'Categoría 2', value: 'Categoría 2' },
    { label: 'Categoría 3', value: 'Categoría 3' }
]);

const norms = ref([
    { label: 'Norma 0312', value: '0312' },
    { label: 'Norma 0313', value: '0313' },
    { label: 'Norma 0314', value: '0314' }
]);

const normDetails = ref({
    name: '',
    requirement: ''
});

onBeforeMount(async () => {
    await getSuggestedEvidence();
    fetchNormDetails();
});

async function getSuggestedEvidence() {
    try {
        const { data } = await getSuggestedEvidenceApi();
        suggestedEvidences.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    suggestedEvidence.value = {
        id: null,
        name: '',
        description: '',
        status: status.value[0]
    };
    fetchNormDetails();
    suggestedEvidenceDialog.value = true;
}

function hideDialog() {
    suggestedEvidenceDialog.value = false;
}

async function saveSuggestedEvidence() {
    if (suggestedEvidence.value.id) {
        const suggestedEvidenceApi = {
            id: suggestedEvidence.value.id,
            name: suggestedEvidence.value.name,
            description: suggestedEvidence.value.description,
            status: suggestedEvidence.value.status.value
        };

        const response = await editSuggestedEvidenceApi(suggestedEvidenceApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Sugerencia de evidencia actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getSuggestedEvidence();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar sugerencia de evidencias.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const suggestedEvidenceApi = {
            name: suggestedEvidence.value.name,
            description: suggestedEvidence.value.description,
            status: suggestedEvidence.value.status.value,
            evidence: suggestedEvidence.value.evidence
        };

        const response = await createSuggestedEvidenceApi(suggestedEvidenceApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Sugerencia de evidencia creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getSuggestedEvidence();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear sugerencia de evidencia.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editSuggestedEvidence(selectedSuggestedEvidence) {
    suggestedEvidence.value = { ...selectedSuggestedEvidence };
    suggestedEvidence.value.status = status.value.find((s) => s.value === selectedSuggestedEvidence.status);
    fetchNormDetails();
    suggestedEvidenceDialog.value = true;
}

async function toggleStatus(selectedSuggestedEvidence) {
    try {
        const response = await toggleActiveSuggestedEvidenceApi(selectedSuggestedEvidence.id);

        if (response.status <= 300) {
            selectedSuggestedEvidence.status = !selectedSuggestedEvidence.status;
            Notify.create({
                message: `Sugerencia de evidencia ${selectedSuggestedEvidence.status ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedSuggestedEvidence.status ? 'blue' : 'rgb(242, 185, 179)',
                multiLine: true
            });
            await getSuggestedEvidence();
        } else {
            throw new Error('Error al actualizar el estado de la sugerencia de evidencia.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la sugerencia de evidencia.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'rgb(242, 185, 179)',
            multiLine: true
        });
    }
}

async function fetchNormDetails() {
    try {
        const { data } = await getNormDetailsApi(suggestedEvidence.value.norm);
        normDetails.value = data;
    } catch (error) {
        console.error(error);
    }
}

function expandAll() {
    expandedRows.value = suggestedEvidences.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
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
