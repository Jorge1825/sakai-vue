<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>CALIFICACIONES</strong>
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
            <!-- Tabla de empresas -->
            <DataTable
                v-model:expandedRows="expandedRows"
                :value="qualifications"
                dataKey="_id"
                responsiveLayout="scroll"
                :paginator="true"
                :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <Column field="name" header="NOMBRE" :sortable="true" style="width: 10%" />
                <Column field="requirement" header="REQUISITO" :sortable="true" style="width: 10%" />
                <Column field="norm" header="NORMA " :sortable="true" style="width: 15%" />
                <Column field="qualificaction" header="EVALUACIÓN" :sortable="true" style="width: 15%" />
                <Column field="evidence" header="EVIDENCIAS" :sortable="true" style="width: 15%" />
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
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="editQualification(slotProps.data)" dense round />
                        </div>
                    </template>
                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Detalles del Prompt: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripción:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Prompt:</strong> {{ slotProps.data.qualification }}</p>
                        <p><strong>Requerimiento:</strong>{{ slotProps.data.requirement }}</p>
                        <p><strong>Norma:</strong> {{ slotProps.data.norm }}</p>
                        <p><strong>Evaluacion:</strong> {{ slotProps.data.qualification }}</p>
                        <p><strong>Evidencia:</strong>{{ slotProps.data.evidence }}</p>
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

    <!-- Modal para agregar/editar empresa -->
    <q-dialog v-model="qualificationDialog" persistent>
        <div class="container bg-white" style="width: 700px; max-width: 80vw; min-width: 400px">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="savePrompt" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px">
                                {{ qualification._id ? 'EDITAR EMPRESA' : 'AGREGAR NUEVA EMPRESA' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Nombre de la empresa requerido']" v-model="qualification.name" label="Nombre de la empresa" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requisito requerido']" v-model="qualification.requirement" label="Requisito" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma requerida']" v-model="qualification.norm" label="Norma" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Evaluacuión requerida']" v-model="qualification.qualification" label="Evaluación" required style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Evidencia requerida']" v-model="qualification.evidence" label="Evidencia" required style="padding: 10px" />
                                </div>
                                <!-- <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Descripción requerida']"
                                        v-model="prompt.description" label="Descripción" required style="padding: 10px"
                                        autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Prompt requerido']"
                                        v-model="prompt.prompt" label="Prompt" required style="padding: 10px"
                                        autogrow />
                                </div> -->
                                <div class="col-6">
                                    <q-select v-model="qualification.status" :options="status" label="Estado" required style="padding: 10px" />
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
import { createQualificationApi, editQualificationApi, toggleActiveQualificationApi } from '@/api/qualifications';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const qualifications = ref([]);
const qualificationDialog = ref(false);
const qualification = ref({
    id: null,
    name: '',
    qualification: '',
    requirement: '',
    norm: '',
    evaluation: '',
    evidence: '',
    //description: '',
    //prompt: '',
    status: true
});
const expandedRows = ref([]);
const status = ref([
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
]);

onBeforeMount(async () => {
    await getQualifications();
});

async function getQualifications() {
    try {
        // esta vista no tiene contexto empresa/norma: sin args no hay endpoint válido
        qualifications.value = [];
    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    qualification.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        qualification: '',
        requirement: '',
        norm: '',
        evaluation: '',
        evidence: '',
        //description: '',
        //prompt: '',
        status: status.value[0]
    };
    qualificationDialog.value = true;
}

function hideDialog() {
    qualificationDialog.value = false;
}
//Guardar empresa
async function savePrompt() {
    console.log(qualification.value);

    if (qualification.value._id) {
        const qualificationApi = {
            id: qualification.value._id,
            name: qualification.value.name,
            qualification: qualification.value.qualification,
            requirement: qualification.value.requirement,
            norm: qualification.value.norm,
            evaluation: qualification.value.evaluation,
            evidence: qualification.value.evidence,
            //description: prompt.value.description,
            //prompt: prompt.value.prompt,
            status: qualification.value.status.value
        };

        const response = await editQualificationApi(qualificationApi);

        if (response.status <= 300) {
            Notify.create({ message: 'Prompt actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getQualifications();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el empresa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    } else {
        const qualificationApi = {
            name: qualification.value.name,
            qualification: qualification.value.qualification,
            requirement: qualification.value.requirement,
            norm: qualification.value.norm,
            evaluation: qualification.value.evaluation,
            evidence: qualification.value.evidence,
            //description: prompt.value.description,
            //prompt: prompt.value.prompt,
            status: qualification.value.status.value
        };

        const response = await createQualificationApi(qualificationApi);
        console.log(response);

        if (response.status <= 300) {
            Notify.create({ message: 'Prompt creado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await sendToOpenAI(qualificationApi); // Envía la calificación a la IA
            await getQualifications();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el empresa.', type: 'negative', position: 'top', textColor: 'white', color: 'rgb(242, 185, 179)', multiLine: true });
        }
    }
}

function editQualification(selectedPrompt) {
    qualification.value = { ...selectedPrompt };
    qualification.value.status = status.value.find((s) => s.value === selectedPrompt.status);
    qualification.value = true;
    console.log(qualification.value);
}

//funcion activar desactivar empresa
async function toggleStatus(selectedPrompt) {
    try {
        // Cambia el estado de la empresa  (activo/inactivo)
        const response = await toggleActiveQualificationApi(selectedPrompt._id);

        if (response.status <= 300) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedPrompt.status = selectedPrompt.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Prompt ${selectedPrompt.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedPrompt.status === 'Activo' ? 'blue' : 'rgb(242, 185, 179)', //rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getQualifications();
        } else {
            throw new Error('Error al actualizar el estado de la empresa.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado de la empresa .',
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
    expandedRows.value = qualifications.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = [];
}
// Funcion para enviar la calificación a la IA
async function sendToOpenAI(prompt) {
    try {
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: ` ` // clave API
            },
            body: JSON.stringify({
                model: '', // Agregar modelo que se est utilizando
                prompt: prompt
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Respuesta de IA:', data);
        return data.choices[0].text.trim(); // Devuelve la respuesta generada
    } catch (error) {
        console.error('Error al enviar la solicitud a OpenAI:', error);
        Notify.create({
            message: 'Error al obtener respuesta de OpenAI.',
            type: 'negative',
            position: 'top'
        });
        return null;
    }
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
