<template>
    <div class="requisitos-panel">
      <h2>{{ titulo }}</h2>
      <ul>
        <li v-for="(requisito, index) in requisitos" :key="index">{{ requisito }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "RequisitosPanel",
    props: {
      titulo: {
        type: String,
        required: true
      },
      requisitos: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  .requisitos-panel {
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px 0;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  </style>
  