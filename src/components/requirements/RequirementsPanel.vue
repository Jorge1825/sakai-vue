<template>
  <div>
    <q-card class="q-ma-md" style="border: 1px solid rgb(4, 178, 217);">
      <q-card-section>
        <h2 class="text-h5" style="color: rgb(4, 178, 217);">LISTA DE REQUERIMIENTOS</h2>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-table
          :rows="requirements"
          :columns="columns"
          row-key="_id"
          class="q-pa-md"
          no-data-label="NO HAY REQUERIMIENTOS DISPONIBLES"
        >
          <template v-slot:top-right>
            <q-btn 
              label="AGREGAR REQUERIMIENTO" 
              @click="openDialog" 
              style="background-color: rgb(4, 178, 217); color: white;" 
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal para agregar requerimiento -->
    <q-dialog v-model="dialog" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">AGREGAR REQUERIMIENTO</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="newRequirement.name" label="NOMBRE" />
          <q-input v-model="newRequirement.description" label="DESCRIPCIÓN" type="textarea" />
          <q-toggle v-model="newRequirement.status" label="ESTADO (ACTIVO/INACTIVO)" />
        </q-card-section>
        <q-card-actions>
          <q-btn label="CANCELAR" @click="closeDialog" />
          <q-btn label="GUARDAR" color="primary" @click="saveRequirement" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script >
import axios from 'axios';

export default {
  data() {
    return {
      requirements: [],
      dialog: false,
      newRequirement: {
        name: '',
        description: '',
        status: true // Por defecto, el estado es activo
      },
      columns: [
        { name: 'name', label: 'NOMBRE', align: 'left', field: 'name' },
        { name: 'description', label: 'DESCRIPCIÓN', align: 'left', field: 'description' },
        { name: 'status', label: 'ESTADO', align: 'center', field: 'status', 
          format: val => (val ? 'ACTIVO' : 'INACTIVO') }
      ]
    };
  },
  mounted() {
    // Hacer una solicitud GET al backend para obtener los requerimientos
    this.fetchRequirements();
  },
  methods: {
    fetchRequirements() {
      axios.get('/api/requirements')
        .then(response => {
          this.requirements = response.data;
        })
        .catch(error => {
          console.error('Error al obtener los requerimientos:', error);
        });
    },
    openDialog() {
      this.dialog = true;
      this.newRequirement = { name: '', description: '', status: true }; // Reiniciar el formulario
    },
    closeDialog() {
      this.dialog = false;
    },
    saveRequirement() {
      // Asegúrate de que la ruta y el formato del dato son correctos
      axios.post('/api/requirements', this.newRequirement)
        .then(() => {
          this.fetchRequirements(); // Recargar la lista de requerimientos
          this.closeDialog(); // Cerrar el modal
        })
        .catch(error => {
          console.error('Error al guardar el requerimiento:', error);
        });
    }
  }
};
</script>

<style scoped>
/* Agrega estilos personalizados si es necesario */
h2 {
  color: rgb(4, 178, 217); /* Color del título */
}
</style>