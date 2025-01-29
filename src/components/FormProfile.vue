<template>
    <div class="text-h6 text-center text-primary q-my-md" style="font-weight: bold; font-size: 24px">PERFIL</div>
    <div class="q-pa-md full-width row">
        <div class="col-5 justify-center flex">
            <q-avatar color="primary" size="8em" text-color="white">J</q-avatar>
        </div>
        <div class="col-7 row flex-col">
            <div class="col-12 text-h5 font-bold">
                {{ user?.username }}
            </div>
            <div class="col-12">
                {{ 
                    user?.role?.name 
                }}
            </div>
            <div class="col-12 q-mt-md" style="font-weight: bold">
                {{ user?.email }}
            </div>
        </div>

        <div class="col-12">
            <q-card class="q-mt-md bg-grey-1 row">
                <q-card-section class="col-6">
                    <div class="text-h6 text-center text-primary text-body1" style="font-weight: bold">EMPRESA</div>
                    <div class="text-h6 text-center q-mt-md" style="font-weight: bold; font-size: 16px">
                        {{ enterprise?.name }}
                    </div>
                </q-card-section>
                <q-card-section class="col-6">
                    <div class="text-h6 text-center text-primary text-body1" style="font-weight: bold">Nivel de riesgo</div>
                    <div class="text-h6 text-center q-mt-md" style="font-weight: bold; font-size: 16px">
                        {{ convertRiskLevel(enterprise?.riskLevel) }}
                    </div>
                </q-card-section>
                <q-card-section class="col-12">
                    <div class="text-h6 text-center text-primary text-body1" style="font-weight: bold">Numero de empleados</div>
                    <div class="text-h6 text-center q-mt-md" style="font-weight: bold; font-size: 16px">
                        {{ enterprise?.numberEmployees }}
                    </div>
                </q-card-section>
            </q-card>
        </div>

        <div class="col-12 flex justify-center q-mt-xl">
            <q-btn
                @click="closeDialog"
                :style="{
                    backgroundColor: 'rgb(4, 178, 217)',
                    color: 'white',
                    borderRadius: '20px'
                }"
                label="Cerrar"
            />
        </div>
    </div>
</template>
<script setup>
import { getEnterprisesByIdApi } from '@/api/enterprises';
import { firstDiagnostic } from '@/api/norms';
import { storeAuth } from '@/store/auth';
import { defineEmits, onBeforeMount, ref } from 'vue';

const emit = defineEmits(['close-dialog']);
const useStoreAuth = storeAuth();

let company = ref();
let user = ref();
let enterprise = ref();

onBeforeMount(async () => {
    // console.log(questions);
    company.value = useStoreAuth.getSelectedCompany();
    user.value = useStoreAuth.decodeToken();


    try {
        const response = await getEnterprisesByIdApi(company.value.value);
        console.log(response.data);
        enterprise.value = response.data;
    } catch (error) {
        console.log(error);
    }
});

const closeDialog = () => {
    emit('close-dialog');
};


const convertRiskLevel = (riskLevel) => {
    switch (riskLevel) {
        case 1:
            return 'I';
        case 2:
            return 'II';
        case 3:
            return 'III';
        case 4:
            return 'IV';
        case 5:
            return 'V';
        default:
            return 'I';
    }
};


</script>
