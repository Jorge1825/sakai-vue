<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Requerimientos</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" /> -->

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <!-- <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" /> -->

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <!-- <q-btn icon="expand_less" :style="{ backgroundColor: 'rgb(242, 185, 179)', color: 'white' }" @click="collapseAll" /> -->
                </div>
            </div>
            <!-- Tabla de empresas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="qualifications"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25, 50, 100]"
            >
                <!-- <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" /> -->
                <Column field="indicator" header="NUMERAL" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ slotProps.data?.indicator }}
                    </template>
                </Column>
                <Column field="requirement" header="REQUISITO" :sortable="true" style="width: 10%">
                    <template #body="slotProps">
                        {{ slotProps.data?.description }}
                    </template>
                </Column>
                <Column field="norm" header="NORMA " :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        {{ slotProps.data?.norm?.name }}
                    </template>
                </Column>

                <Column field="evidence" header="EVIDENCIAS" :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        <q-btn
                            icon="visibility"
                            :style="{
                                backgroundColor: slotProps.data?.evidence && slotProps.data?.evidence?.length > 0 ? 'rgb(2, 232, 124)' : 'rgb(242, 185, 179)',
                                color: 'white'
                            }"
                            @click="viewFiles(slotProps.data.evidence)"
                            dense
                            round
                            class="q-mr-md"
                        />
                    </template>
                </Column>
                <Column header="EVALUAR REQUISITO" style="width: 10%">
                    <template #body="slotProps">
                        <div class="button-group">
                            <!-- Botón que cambia color de fondo sin afectar el icono -->

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="evaluateQualification(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <Column field="qualificaction" header="EVALUACIÓN" :sortable="true" style="width: 15%">
                    <template #body="slotProps">
                        {{ calculateQualification(slotProps.data) }}
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <p><strong>Description:</strong>{{ slotProps.data.description }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data?.norm?.name }}</p>
                        <p><strong>Calificación:</strong> {{ slotProps.data?.evaluation }}</p>
                        <p><strong>Evidencia:</strong>{{ slotProps.data?.evidence }}</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar empresa -->
    <q-dialog v-model="qualificationDialog" persistent>
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 30vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">EVALUAR REQUISITO</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-pb-lg q-pt-md justify-center flex">
                                <div class="col-4">
                                    <q-select disable v-model="norm" :options="norms" label="Norma" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Norma requerida']" @update:model-value="getRequirements()" />
                                </div>

                                <div class="col-5">
                                    <q-select
                                        :disable="!norm"
                                        v-model="requirement"
                                        :options="requirements"
                                        label="Requisito"
                                        required
                                        style="padding: 10px"
                                        lazy-rules
                                        :rules="[(val) => val || 'Requerimiento']"
                                        @update:model-value="listRequirements()"
                                    />
                                </div>

                                <div class="col-3">
                                    <q-select v-model="year" :options="yearOptions" label="Año Evaluado" required style="padding: 10px" lazy-rules :rules="[(val) => val || 'Año requerido']" />
                                </div>

                                <div class="col-10 q-mt-md" style="overflow-y: auto; max-height: 400px">
                                    <table class="tablereq">
                                        <thead>
                                            <tr>
                                                <th>Selección</th>
                                                <th>Descripción</th>
                                                <th>Evidencias sugeridas</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="input in inputs" :key="input._id">
                                                <td class="col-value">
                                                    <q-checkbox disable v-model="input.selected" />
                                                </td>
                                                <td class="col-req-description">
                                                    {{ input.description }}
                                                </td>
                                                <td class="col-req-description">
                                                    <div v-html="renderSuggested(input.suggestedEvidence)"></div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="col-12 justify-center flex q-py-lg">
                                    <template v-for="(file, index) in files" :key="index">
                                        <div class="col-12 justify-center flex items-center">
                                            <q-chip removable @remove="files.splice(index, 1)">
                                                <q-icon name="attachment" />
                                                <div class="q-chip-main">
                                                    {{ file?.name }}
                                                </div>
                                            </q-chip>
                                        </div>
                                    </template>
                                    <template v-if="!files.length"> No se ha seleccionado un archivo </template>
                                </div>
                                <div class="col-12 justify-center flex items-center">
                                    <input multiple type="file" id="inputFile" @change="selectFile" style="display: none" accept=".pdf,.txt,.jpg,.jpeg,.png" />
                                    <q-btn :disable="!norm || !requirement || !inputs.length" class="q-mx-sm flex" filled label="Cargar Evidencia" color="primary" @click="uploadFile" />
                                </div>
                            </div>
                        </q-card-section>
                        <q-card-actions align="right">
                            <q-btn class="q-mx-sm" outline label="Cancelar" color="negative" @click="hideDialog" />
                            <q-btn class="q-mx-sm" outline label="EVALUAR" color="primary" @click="uploadFileServer()" />
                        </q-card-actions>
                    </q-form>
                </q-card>
                <div class="watermark"></div>
            </div>
        </div>
    </q-dialog>
    <q-dialog v-model="viewDocument" persistent>
        <div class="container bg-white" style="min-width: 450px; max-width: 85vw; min-height: 30vh; max-height: 90vh">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-card-section>
                        <div class="text-h6 text-center text-primary w-full" style="font-weight: bold; font-size: 24px">EVIDENCIAS CARGADAS</div>
                    </q-card-section>
                    <q-card-section v-for="(evidence, index) in evidencesView" :key="index" class="row justify-center flex q-gutter-x-md q-gutter-y-md">
                        <div class="col-10">
                            Fecha de carga: {{ evidence.date }}
                            <hr />
                        </div>

                        <div class="col-10 col-sm-5 col-md-3" v-for="(file, fIndex) in evidence.evidences" :key="fIndex">
                            <q-card class="my-card bg-grey-11" flat bordered>
                                <div class="q-pa-sm text-center bg-grey-1">
                                    <div>{{ file.originalname }}</div>
                                </div>
                                <div class="justify-center flex">
                                    <q-icon :name="'description'" size="10rem" class="text-primary" />
                                </div>
                                <div class="justify-center flex q-py-sm">
                                    <q-btn
                                        icon="visibility"
                                        :style="{
                                            backgroundColor: 'rgb(4, 178, 217)',
                                            color: 'white'
                                        }"
                                        @click="renderFile(file?.name)"
                                        dense
                                        round
                                        class="q-mr-md"
                                    />
                                    <q-btn
                                        icon="cloud_download"
                                        :style="{
                                            backgroundColor: 'rgb(4, 178, 217)',
                                            color: 'white'
                                        }"
                                        @click="downloadFile(file?.name)"
                                        dense
                                        round
                                    />
                                </div>
                            </q-card>
                        </div>
                    </q-card-section>

                    <q-card-section class="w-full">
                        <div class="col-12 justify-center flex q-py-xs">
                            <q-btn class="q-mx-sm" outline label="Cerrar" color="negative" @click="viewDocument = false" />
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </q-dialog>
</template>

<script setup>
import { getFileApi } from '@/api/files';
import { getNormEnterpriseApi } from '@/api/norms';
import { useTaskPolling } from '@/composables/useTaskPolling';

const { isProcessing, taskStatus, taskResult, taskError, startPolling } = useTaskPolling();

async function uploadFileServer() {
    try {
        if (!files.value || files.value.length === 0) {
            notifyError({ message: 'Debe seleccionar un archivo.' });
            return;
        }

        const formData = new FormData();
        files.value.forEach((file) => {
            formData.append('files', file);
        });
        formData.append('normId', norm.value.value);
        formData.append('enterpriseId', enterprise.value.value);
        formData.append('requirementId', requirement.value.value);
        formData.append('inputs', JSON.stringify(inputs.value.filter((i) => i.selected).map((i) => i._id)));
        formData.append('year', year.value);

        const response = await processRequirementsApi(formData);

        if (response.data && response.data.taskId) {
            Notify.create({
                message: 'Procesando archivos...',
                color: 'info',
                position: 'bottom-right',
                timeout: 0,
                group: 'task-polling'
            });

            startPolling(response.data.taskId, async (result) => {
                if (result.errors && result.errors.length > 0) {
                    result.errors.forEach((error) => {
                        notifyError({ message: error });
                    });
                } else {
                    notifySuccess({ message: 'Requisitos procesados correctamente.' });
                }

                if (result.finished) {
                    notifySuccess({ message: 'Tu diagnóstico está listo para ser revisado.' });
                }

                await getQualifications();
                hideDialog();
                
                // Dismiss progress notification
                Notify.create({
                    group: 'task-polling',
                    timeout: 1
                });
            });
        } else {
            notifyError({ message: 'Error al iniciar el procesamiento.' });
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al actualizar la norma.' });
    }
}

function calculateQualification(data) {
    //tomar el valor mayor entre cumple, noCumple, justifica, noJustifica
    const values = [data?.cumple || 0, data?.noCumple || 0, data?.justifica || 0, data?.noJustifica || 0];
    const maxValue = Math.max(...values);
    return maxValue;
}

async function renderFile(nameFile) {
    if (!nameFile) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    const response = await getFileApi(nameFile);

    if (response.status <= 300) {
        const documentUrl = URL.createObjectURL(response.data);

        //abrir otra ventana con el archivo
        window.open(documentUrl, '_blank');
    } else {
        notifyError({ message: 'Error al obtener el archivo.' });
    }
}

async function viewFiles(evidences) {
    if (!evidences || evidences.length == 0) {
        return;
    }

    evidencesView.value = [];
    //agrupar las evidencias por día
    const data = evidences.reduce((acc, evidence) => {
        const date = new Date(evidence.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(evidence);
        return acc;
    }, {});

    for (const key in data) {
        evidencesView.value.push({
            date: key,
            evidences: data[key]
        });
    }

    viewDocument.value = true;
}

async function downloadFile(nameFile) {
    if (!nameFile) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    const response = await getFileApi(nameFile);

    if (response.status <= 300) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nameFile);
        document.body.appendChild(link);
        link.click();
    } else {
        notifyError({ message: 'Error al obtener el archivo.' });
    }
}

// Funciones para expandir y colapsar
function expandAll() {
    expandedRows.value = qualifications.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
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

.tablereq {
    width: 100%;
    border-collapse: collapse;
}

.tablereq th,
.tablereq td {
    border: 1px solid #ddd;
    padding: 8px;
}

.tablereq th {
    background-color: #f2f2f2;
    text-align: left;
}

/* Limitar el tamaño máximo de cada columna */
.col-number {
    max-width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-title {
    max-width: 40px;
    overflow: hidden;
    text-align: center;
}

.col-requirements {
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.col-req-number {
    max-width: 35px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-req-title {
    max-width: 60px;
    overflow: hidden;
    white-space: wrap;
}

.col-req-description {
    max-width: 300px;
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
}

.col-value {
    max-width: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}

.col-actions {
    max-width: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
}
</style>
