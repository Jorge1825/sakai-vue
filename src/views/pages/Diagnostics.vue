<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>DIAGNOSTICO</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" /> -->

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" />
                </div>
            </div>
            <!-- Tabla de diagnosticos -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="diagnostics"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="norm" header="NORMA" style="width: 50%">
                    <template #body="slotProps">
                        {{ slotProps.data?.norm?.name }}
                    </template>
                </Column>
                <Column field="levelOfCompliance" header="PORCENTAJE DE CUMPLIMIENTO" style="width: 10%">
                    <template #body="slotProps">
                        <q-chip :label="`${100- (100 - (slotProps.data?.cumple + slotProps.data?.justifica))}`" />
                    </template>
                </Column>
                <Column field="levelOfCompliance" header="CUMPLE TOTALMENTE" style="width: 10%">
                    <template #body="slotProps">
                        <q-chip :color="'green'" :label="`${slotProps.data?.cumple}`" />
                    </template>
                </Column>
                <Column field="levelOfCompliance" header="NO CUMPLE" style="width: 10%">
                    <template #body="slotProps">
                        <q-chip :color="'green'" :label="`${slotProps.data?.noCumple}`" />
                    </template>
                </Column>
                <Column field="levelOfCompliance" header="JUSTIFICA" style="width: 10%">
                    <template #body="slotProps">
                        <q-chip :color="'green'" :label="`${slotProps.data?.justifica}`" />
                    </template>
                </Column>
                <Column field="levelOfCompliance" header="NO JUSTIFICA" style="width: 10%">
                    <template #body="slotProps">
                        <q-chip :color="'green'" :label="`${slotProps.data?.noJustifica}`" />
                    </template>
                </Column>
                <Column header="DIAGNÓSTICO DESCARGABLE" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón de ojo para ver detalles del diagnostico -->
                            <q-btn icon="visibility" :style="{ color: 'rgb(4, 178, 217)' }" @click="viewDiagnostic(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del diagnostico: {{ slotProps.data.name }}</h5>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Nivel de cumplimento:</strong> {{ slotProps.data.levelOfCompliance }}</p>
                        >
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar diagnostico -->
    <q-dialog v-model="diagnosticDialog" persistent width="800px">
        <div class="container bg-white">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveDiagnostic" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ diagnostic._id ? 'EDITAR DIAGNOSTICO' : 'NUEVO DIAGNOSTICO' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Estandar requerido']" v-model="diagnostic.standard" label="Estandar" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Item de estandar requerido']" v-model="diagnostic.standardItem" label="Item de estandar" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Valor requerido']" v-model="diagnostic.value" label="Valor" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input
                                        type="number"
                                        lazy-rules
                                        :rules="[(val) => (!isNaN(val) && val !== null && val !== '') || 'Debe ser un número decimal válido']"
                                        v-model.number="diagnostic.percentageWeight"
                                        label="Peso porcentual"
                                        required
                                        style="padding: 10px"
                                    />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Cumple totalmente requerido']" v-model="diagnostic.fullyComplies" label="Cumple totalmente" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'No cumple requerido']" v-model="diagnostic.doesNotComply" label="No cumple" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Justifica requerido']" v-model="diagnostic.justifies" label="Justifica" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'No justifica requerido']" v-model="diagnostic.doesNotJustify" label="No justifica" required style="padding: 10px" />
                                </div>
                            </div>
                        </q-card-section>

                        <!-- <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre del diagnostico requerido']" v-model="diagnostic.name" label="Nombre del diagnostico" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']" v-model="diagnostic.description" label="Descripción" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma']" v-model="diagnostic.norm" label="Norma" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requerimiento']" v-model="diagnostic.requirement" label="Requerimiento" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input type="number" lazy-rules :rules="[(val) => (!isNaN(val) && val !== null && val !== '') || 'Debe ser un número decimal válido']" v-model.number="diagnostic.levelOfCompliance" label="Nivel de cumplimiento del requerimiento" required style="padding: 10px" autogrow
                                    />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Empresa']" v-model="diagnostic.enterprise" label="Empresa" required style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="diagnostic.status" :options="status" label="Estado" required style="padding: 10px" />
                                </div>
                            </div>
                        </q-card-section> -->

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
import { createDiagnosticApi, editDiagnosticApi } from '@/api/diagnostics'; //ROLES
import { getQualificationsByEnterprise } from '@/api/qualifications';
import { storeAuth } from '@/store/auth';
import { generateDiagnostic } from '@/utils/generateDiagnostic';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const useStoreAuth = storeAuth();

const diagnostics = ref([]);
const diagnosticDialog = ref(false);
const diagnostic = ref({
    id: null,
    name: '',
    description: '',
    norm: '',
    requirement: '',
    levelOfCompliance: 0,
    enterprise: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);
const enterprise = ref(null);

const dataTable = ref(null);

onBeforeMount(async () => {
    enterprise.value = useStoreAuth.getSelectedCompany();
    await getDiagnostic();
});

async function getDiagnostic() {
    try {
        const { data } = await getQualificationsByEnterprise(enterprise.value.value);
        diagnostics.value = data.length ? data : [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    diagnostic.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norm: '',
        requirement: '',
        levelOfCompliance: 0,
        enterprise: '',
        status: true
    };
    diagnosticDialog.value = true;
}

function hideDialog() {
    diagnosticDialog.value = false;
}

async function saveDiagnostic() {
    console.log(diagnostic.value);

    if (diagnostic.value._id) {
        const diagnosticApi = {
            id: diagnostic.value._id,
            name: diagnostic.value.name,
            description: diagnostic.value.description,
            norm: diagnostic.value.norm,
            requirement: diagnostic.value.requirement,
            levelOfCompliance: diagnostic.value.levelOfCompliance,
            enterprise: diagnostic.value.enterprise,
            status: diagnostic.value.status
        };

        const response = await editDiagnosticApi(diagnosticApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Diagnostico actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getDiagnostic();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el diagnostico.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const diagnosticApi = {
            name: diagnostic.value.name,
            description: diagnostic.value.description,
            norm: diagnostic.value.norm,
            requirement: diagnostic.value.requirement,
            levelOfCompliance: diagnostic.value.levelOfCompliance,
            enterprise: diagnostic.value.enterprise,
            status: diagnostic.value.status
        };

        const response = await createDiagnosticApi(diagnosticApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Diagnostico creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getDiagnostic();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el diagnostico.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = diagnostics.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}

async function viewDiagnostic(selectedDiagnostic) {
    let data = [];
    let dataTotals = {
        total: selectedDiagnostic.total,
        cumple: selectedDiagnostic.cumple,
        noCumple: selectedDiagnostic.noCumple,
        justifica: selectedDiagnostic.justifica,
        noJustifica: selectedDiagnostic.noJustifica,
        totalGeneral: selectedDiagnostic.cumple + selectedDiagnostic.justifica
    }

    selectedDiagnostic.requirements.forEach((requirement) => {
        const req = selectedDiagnostic?.namesRequirement.find((name) => name._id == requirement.requirement);

        if (!req) {
            return;
        }

        let reqChild;
        req?.requirements?.forEach((child) => {
            child.inputs?.forEach((input) => {
                if (input._id == requirement.id) {
                    reqChild = {
                        id: child._id,
                        number: child.number,
                        description: child.description,
                        title: child.title
                    };
                }
            });
        });



        data.push({
            reqChild,
            norm: selectedDiagnostic.norm.name,
            normId: selectedDiagnostic.norm._id,
            nameRequirement: req.title,
            numberRequirement: req.number,
            idRequirement: req._id,
            item: requirement.description,
            value: requirement.value,
            percentageWeight: requirement.value,
            fullyComplies: requirement.cumple,
            doesNotComply: requirement.noCumple,
            justifies: requirement.justifica,
            doesNotJustify: requirement.noJustifica,
            valueTotal: parseFloat(requirement.cumple || 0) + parseFloat(requirement.justifica || 0)
        });
    });

    //crear grupos por cada idRequirement
    data = data.reduce((acc, item) => {
        const found = acc.find((group) => group.idRequirement === item.idRequirement);
        if (!found) {
            acc.push({
                quantity: 1,
                idRequirement: item.idRequirement,
                nameRequirement: item.nameRequirement,
                numberRequirement: item.numberRequirement,
                norm: item.norm,
                normId: item.normId,
                items: [item]
            });
        } else {
            found.items.push(item);
            found.quantity++;
        }
        return acc;
    }, []);

    //ahora dentro de items, crear grupos por cada idChild
    data.forEach((group) => {
        group.items = group.items.reduce((acc, item) => {
            const found = acc.find((child) => child.reqChild.id === item.reqChild.id);
            if (!found) {
                acc.push({
                    quantity: 1,
                    reqChild: item.reqChild,
                    items: [item]
                });
            } else {
                found.items.push(item);
                found.quantity++;
            }
            return acc;
        }, []);
    });

    dataTable.value = data.sort((a, b) => a.numberRequirement - b.numberRequirement);


    await generateDiagnostic(dataTable.value, dataTotals);
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

.table-diag tr {
    text-align: center;
}
.table-diag tr td {
    border: 1px solid;
}
</style>
