<template>
    <div class="col-span-12">
        <div class="q-my-md row justify-between"></div>
        <div class="card full-height" style="min-height: 82vh">
            <div class="row q-my-md">
                <div class="col-6">
                    <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                        <strong>Calificacion</strong>
                    </div>
                </div>
                <div class="col-12 flex justify-end">
                    <!-- Botón de agregar con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                        @click="openDialog" class="q-mr-sm" />

                    <!-- Botón de expandir con fondo azul claro y color de ícono blanco -->
                    <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                        @click="expandAll" class="q-mr-sm" />

                    <!-- Botón de colapsar con fondo rojo y color de ícono blanco -->
                    <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }"
                        @click="collapseAll" />
                </div>

            </div>
            <!-- Tabla de usuarios -->
            <DataTable v-model:expandedRows="expandedRows" :value="qualifications" dataKey="_id"
                responsiveLayout="scroll" :paginator="true" :rows="10"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]">
                <Column field="nameEnterprise" header="NOMBRE EMPRESA" :sortable="true" style="width: 15%" />
                <Column field="descriptions" header="DESCRIPCION" style="width: 35%" />
                <Column field="norms" header="NORMA" style="width: 35%" />
                <Column field="qualification" header="EVALUACION" style="width: 35%" />
                <Column field="evidence" header="EVIDENCIAS" style="width: 10%; text-align: left; text-transform: uppercase">
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

                            <!-- Botón de edición con fondo azul claro y sin cambiar el color del icono -->
                            <q-btn icon="edit" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                                @click="editQualification(slotProps.data)" dense round />
                        </div>
                    </template>


                </Column>
                <template #expansion="slotProps">
                    <div class="p-4">
                        <h5>Nombre de la empresa: {{ slotProps.data.name }}</h5>
                        <p><strong>Descripcion:</strong> {{ slotProps.data.description }}</p>
                        <p><strong>Normas:</strong> {{ slotProps.data.norms }}</p>
                        <p><strong>Evaluacion:</strong> {{ slotProps.data.qualification }}</p>
                        <p><strong>Evidencias:</strong> {{ slotProps.data.evidences }}</p>
                    </div>
                </template>
            </DataTable>
        </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <q-dialog v-model="qualificationDialog" persistent>
        <div class="container bg-white" style="width: 700px; max-width: 80vw;min-width: 400px;">
            <div class="watermark-container justify-center flex">
                <q-card class="justify-center flex bg-transparent full-width">
                    <q-form @submit.prevent.stop="saveQualification" novalidate class="q-pa-md full-width">
                        <q-card-section>
                            <div class="text-h6 text-center text-primary" style="font-weight: bold; font-size: 24px;">
                                {{ qualification._id ? 'EDITAR PROMPT' : 'NUEVO PROMPT' }}
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row full-width q-py-lg">
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Nombre del la empresa requerido']"
                                        v-model="qualification.name" label="Nombre de la empresa" required
                                        style="padding: 10px" />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Requerimiento']"
                                        v-model="qualification.description" label="Requerimiento" required
                                        style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Norma']"
                                        v-model="qualification.norms" label="Norma" required style="padding: 10px"
                                        autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules :rules="[(val) => (val && val.length > 0) || 'Evaluacion']"
                                        v-model="qualification.qualification" label="Evaluacion" required
                                        style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-input lazy-rules
                                        :rules="[(val) => (val && val.length > 0) || 'Evidencias requerido']"
                                        v-model="qualification.evidences" label="Evidencias" required
                                        style="padding: 10px" autogrow />
                                </div>
                                <div class="col-6">
                                    <q-select v-model="qualification.status" :options="status" label="Estado" required
                                        style="padding: 10px" />
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
import { createQualificationApi, editQualificationApi, getQualificationsApi, toggleActiveQualificationApi } from '@/api/qualifications';
import { Notify } from 'quasar';
import { onBeforeMount, ref } from 'vue';

const qualifications = ref([]);
const qualificationDialog = ref(false);
const qualification = ref({
    id: null,
    name: '',
    description: '',
    norms: '',
    qualification: '',
    evidences:'',
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
        const { data } = await getQualificationsApi();
        console.log(data);
        qualifications.value = data.length ? data : [];

    } catch (error) {
        console.error(error);
    }
}

function openDialog() {
    qualification.value = {
        // Reinicar el objeto usuario
        id: null,
        name: '',
        description: '',
        norms: '',
        qualification: '',
        evidences:'',
        status: true
    };
    qualificationDialog.value = true;
}

function hideDialog() {
    qualificationDialog.value = false;
}

async function saveQualification() {
    console.log(qualification.value);

    if (qualification.value._id) {
        const qualificationApi = {
            id: qualification.value._id,
            name: qualification.value.name,
            description: qualification.value.description,
            norms: qualification.value.norms,
            qualification: qualification.value.qualification,
            evidences: qualification.value.evidences,
            status: qualification.value.status.value
        };

        const response = await editQualificationApi(qualificationApi);

        if (response.status === 200) {
            Notify.create({ message: 'calificacion actualizado correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getQualifications();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al actualizar el calificacion.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    } else {
        const qualificationApi = {
            id: qualification.value._id,
            name: qualification.value.name,
            description: qualification.value.description,
            norms: qualification.value.norms,
            qualification: qualification.value.qualification,
            evidences: qualification.value.evidences,
            status: qualification.value.status.value
        };

        const response = await createQualificationApi(qualificationApi);
        console.log(response);

        if (response.status === 200) {
            Notify.create({ message: 'Calificacion creada correctamente.', type: 'positive', position: 'top', textColor: 'white', color: 'blue', multiLine: true });
            await getQualifications();
            hideDialog();
        } else {
            Notify.create({ message: 'Error al crear el calificacion.', type: 'negative', position: 'top', textColor: 'white', color: 'red', multiLine: true });
        }
    }
}

function editQualification(selectedQualification) {
    qualification.value = { ...selectedQualification };
    qualification.value.status = status.value.find((s) => s.value === selectedQualification.status);
    qualificationDialog.value = true;
    console.log(qualification.value);
}

//funcion activar desactivavr usuario
/*async function toggleStatus(selectedQualification) {
    try {
        // Cambia el estado del usuario (activo/inactivo)
        const response = await toggleActiveQualificationApi(selectedQualification._id);

        if (response.status === 200) {
            // Actualiza el estado localmente después de recibir respuesta del backend
            selectedQualification.status = selectedQualification.status === 'Activo' ? 'Inactivo' : 'Activo';

            // Mostrar notificación de éxito
            Notify.create({
                message: `Qualification ${selectedQualification.status === 'Activo' ? 'activado' : 'desactivado'} correctamente.`,
                type: 'positive',
                position: 'top',
                textColor: 'white',
                color: selectedQualification.status === 'Activo' ? 'blue' : 'red',//rgb(4, 178, 217)
                multiLine: true
            });

            // Vuelve a cargar los usuarios si es necesario
            await getQualifications();
        } else {
            throw new Error('Error al actualizar el estado del calificacion.');
        }
    } catch (error) {
        console.error(error);
        Notify.create({
            message: 'Hubo un error al cambiar el estado del calificacion.',
            type: 'negative',
            position: 'top',
            textColor: 'white',
            color: 'red',
            multiLine: true
        });
    }
}*/

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
</style>
