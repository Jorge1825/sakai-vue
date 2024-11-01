<template>
  <div class="col-span-12">
    <div class="q-my-md row justify-between"></div>
    <div class="card full-height" style="min-height: 82vh">
      <div class="row q-my-md">
        <div class="col-6 flex items-center">
          <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
            <strong>Tabla De Normas</strong>
          </div>
        </div>
        <div class="col-12 flex justify-end">
          <!-- Botón de agregar -->
          <q-btn icon="add" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="openDialog" class="q-mr-sm" />
          <!-- Botón de expandir -->
          <q-btn icon="expand_more" :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }" @click="expandAll" class="q-mr-sm" />
          <!-- Botón de colapsar -->
          <q-btn icon="expand_less" :style="{ backgroundColor: 'red', color: 'white' }" @click="collapseAll" />
        </div>
      </div>
      <!-- Tabla de normas -->
      <DataTable
        v-model:expandedRows="expandedRows"
        :value="norms"
        dataKey="_id"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
      >
        <Column field="name" header="NUMBER" :sortable="true" style="width: 5%" />
        <Column field="description" header="TITULO" style="width: 10%" />
        <Column field="requirements" header="REQUISITOS" style="width: 50%">
          <template #body="slotNorms">
            {{ slotNorms.data.requirements }}
          </template>
        </Column>
        <!-- Columna de calificaciones (para números) -->
        <Column field="score" header="CALIFICACIONES" style="width: 5%">
          <template #body="slotNorms">
            <q-input v-model="slotNorms.data.score" type="number" dense />
          </template>
        </Column>
        <!-- Columna para el botón "ojo" en cada fila -->
        <Column header="MAS" style="width: 5%">
          <template #body="slotNorms">
            <q-btn icon="visibility" :style="{ color: 'rgb(4, 178, 217)' }" @click="botonMostrarDelOjo(slotNorms.data)" dense round />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const norms = ref([
// Datos de ejemplo
  { _id: 1, name: '001/6503', description: 'Norma de seguridad', requirements: 'La norma de seguridad dicta que.....', score: 0 },
  { _id: 2, name: '002/6504', description: 'Norma de calidad', requirements: 'La norma de calidad dicta que.....', score: 0 },
  { _id: 3, name: '003/6505', description: 'Norma de ambiente', requirements: 'La norma de ambeinte dicta que.....', score: 0 }
]);
const expandedRows = ref([]);
const status = ref([
  { label: 'ACTIVA', value: true },
  { label: 'INACTIVA', value: false }
]);

const openDialog = () => {
    newRequirement.value = { id: null, name: '', description: '', status: status.value[0] };
};

function expandAll() {
  expandedRows.value = norms.value.reduce((acc, p) => (acc[p._id] = true) && acc, {});
}
function collapseAll() {
  expandedRows.value = [];
}

function botonMostrarDelOjo(norm) {
}

</script>
