<script setup>
import { onBeforeMount } from 'vue';
import { storeAuth } from './store/auth.js';

const useStoreAuth = storeAuth();

onBeforeMount(() => {
  useStoreAuth.loadToken();
  useStoreAuth.decodeToken();
});

</script>

<template>
    <router-view />
</template>

<style scoped></style>
