<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>SUGERENCIAS DE EVIDENCIAS</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" />
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
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" />
                <Column field="description" header="DESCRIPCIÓN" style="width: 10%" />
                <Column field="norm" header="NORMA" style="width: 10%" />
                <Column field="requirement" header="REQUERIMIENTO" style="width: 10%" />
                <Column field="evidence" header="EVIDENCIA" style="width: 10%" />
<!--                 <Column field="enterprise" header="EMPRESA" style="width: 10%" /> -->
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
                            <q-btn
                                :icon="slotProps.data.status === true ? 'clear' : 'check'"
                                :style="{ backgroundColor: slotProps.data.status === true ? 'red' : 'rgb(4, 178, 217)', color: 'white' }"
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
                        <h5>Nombre de la sugerencia de evidencia: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Requerimiento:</strong> {{ slotProps.data.requirement }}</p>
                        <p><strong>Nivel de cumplimiento:</strong> {{ slotProps.data.levelOfCompliance }}</p>
                        <p><strong>Empresa:</strong> {{ slotProps.data.enterprise }}</p>
                        <p><strong>Valor:</strong> {{ slotProps.data.fieldvalue }}</p>
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

    <q-dialog v-model="suggestedEvidenceDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveSuggestedEvidence" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ suggestedEvidence._id ? 'EDITAR SUGERENCIA DE EVIDENCIA' : 'NUEVA SUGERENCIA DE EVIDENCIA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-select v-model="selectedNorm" :options="normOptions" label="Norma" @change="loadRequirements" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input v-model="selectedRequirement" label="Requerimiento" disabled style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input v-model="suggestedEvidence.name" label="Nombre de la sugerencia de la evidencia" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input v-model="suggestedEvidence.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-12">
                                    <q-input type="textarea" v-model="suggestedEvidence.evidence" label="Evidencia" required style="padding: 10px" autogrow />
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
import { createSuggestedEvidenceApi, editSuggestedEvidenceApi, getSuggestedEvidenceApi, toggleActiveSuggestedEvidenceApi, getNormsApi, getRequirementsApi } from '../../api/suggestedEvidence';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const suggestedEvidences = ref([]);
const suggestedEvidenceDialog = ref(false);
const suggestedEvidence = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    requirement: '',
    evidence: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const norms = ref([]);
const requirements = ref([]);
const selectedNorm = ref(null);
const selectedRequirement = ref('');

const normOptions = [
    { label: 'Mensual', value: 'mensual' },
    { label: 'Bimestral', value: 'bimestral' },
    { label: 'Trimestral', value: 'trimestral' },
    { label: 'Semestral', value: 'semestral' },
    { label: 'Anual', value: 'anual' },
];

onBeforeMount(async () => {
    await getSuggestedEvidence();
    await loadNorms();
});

async function getSuggestedEvidence() {
    try {
        const { data } = await getSuggestedEvidenceApi();
        suggestedEvidences.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

async function loadNorms() {
    try {
        const { data } = await getNormsApi();
        norms.value = data;
        if (norms.value.length > 0) {
            selectedNorm.value = norms.value[0].value;
            await loadRequirements();
        }
    } catch (error) {
        console.error(error);
    }
}

async function loadRequirements() {
    try {
        const { data } = await getRequirementsApi(selectedNorm.value);
        requirements.value = data;
        if (requirements.value.length > 0) {
            selectedRequirement.value = requirements.value[0].value;
        }
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    suggestedEvidence.value = {
        id: null,
        name: '',
        description: '',
        norm: '',
        requirement: '',
        evidence: '',
        status: status.value[0].value
    };
    suggestedEvidenceDialog.value = true;
}

function hideDialog() {
    suggestedEvidenceDialog.value = false;
}

async function saveSuggestedEvidence() {
    if (suggestedEvidence.value._id) {
        const suggestedEvidenceApi = {
            id: suggestedEvidence.value._id,
            name: suggestedEvidence.value.name,
            description: suggestedEvidence.value.description,
            norm: selectedNorm.value,
            requirement: selectedRequirement.value,
            evidence: suggestedEvidence.value.evidence,
            status: suggestedEvidence.value.status
        };

        const response = await editSuggestedEvidenceApi(suggestedEvidenceApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Sugerencia de evidencia actualizada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getSuggestedEvidence();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar la evidencia.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const suggestedEvidenceApi = {
            name: suggestedEvidence.value.name,
            description: suggestedEvidence.value.description,
            norm: selectedNorm.value,
            requirement: selectedRequirement.value,
            evidence: suggestedEvidence.value.evidence,
            status: suggestedEvidence.value.status
        };

        const response = await createSuggestedEvidenceApi(suggestedEvidenceApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Sugerencia de evidencia creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getSuggestedEvidence();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear la evidencia.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editSuggestedEvidence(selectedSuggestedEvidence) {
    suggestedEvidence.value = { ...selectedSuggestedEvidence };
    selectedNorm.value = selectedSuggestedEvidence.norm;
    selectedRequirement.value = selectedSuggestedEvidence.requirement;
    suggestedEvidenceDialog.value = true;
}

async function toggleStatus(selectedSuggestedEvidence) {
    try {
        const response = await toggleActiveSuggestedEvidenceApi(selectedSuggestedEvidence._id);

        if (response.status <= 300) {
            selectedSuggestedEvidence.status = !selectedSuggestedEvidence.status;

            Notify.create({
                message: `Sugerencia de la evidencia ${selectedSuggestedEvidence.status ? 'activada' : 'desactivada'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedSuggestedEvidence.status ? 'blue' : 'red',
                multiLine: true
            });

            await getSuggestedEvidence();
        } else {
            throw new Error('Error al actualizar el estado de la evidencia.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la actividad.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}

function expandAll() {
    expandedRows.value = suggestedEvidences.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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