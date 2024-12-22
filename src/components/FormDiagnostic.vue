<template>
    <div class="text-h6 text-center text-primary q-my-md" style="font-weight: bold; font-size: 24px">EVALUACIÓN EXPRESS DE CUMPLIMIENTO</div>
    <div class="q-pa-md full-width">
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
            <q-step :name="1" title="Cuestionario" icon="settings"  :header-nav="step > 1">
                <div class="row full-width q-my-lg">
                    <div class="col-12 q-mt-md">
                        <div class="row justify-center flex">
                            
                            <div class="col-4 q-px-md" v-for="(question, index) in questions.slice(0, 3)" :key="index">
                                <div class="q-pa-sm">
                                    <p>{{ question.text }}</p>
                                    <div>
                                        <q-checkbox v-model="question.cumple" label="Cumple" @update:model-value="updateCheckbox(question, 'cumple', 'noCumple')" />
                                        <q-checkbox v-model="question.noCumple" label="No cumple" @update:model-value="updateCheckbox(question, 'noCumple', 'cumple')" />
                                    </div>
                                </div>
                            </div>
                            
                            <div class="col-4 q-px-md q-mt-xl" v-for="(question, index) in questions.slice(3, 6)" :key="index">
                                <div class="q-pa-sm">
                                    <p>{{ question.text }}</p>
                                    <div>
                                        <q-checkbox v-model="question.cumple" label="Cumple" @update:model-value="updateCheckbox(question, 'cumple', 'noCumple')" />
                                        <q-checkbox v-model="question.noCumple" label="No cumple" @update:model-value="updateCheckbox(question, 'noCumple', 'cumple')" />

                                    </div>
                                </div>
                            </div>
                            <div class="col-4 q-px-md flex flex-center q-mt-xl">
                                <div class="q-pa-sm">
                                    <p>{{ questions[6].text }}</p>
                                    <div>

                                        <q-checkbox v-model="questions[6].cumple" label="Cumple" @update:model-value="updateCheckbox(questions[6], 'cumple', 'noCumple')" />
                                        <q-checkbox v-model="questions[6].noCumple" label="No cumple" @update:model-value="updateCheckbox(questions[6], 'noCumple', 'cumple')" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn flat color="primary" label="Omitir" class="q-mx-md" @click="close()" />
                        <q-btn
                            @click="continueStep"
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step :name="2" title="Diagnostico" icon="add_comment" :header-nav="step > 2">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl text-primary"> TÚ DIAGNOSTICO RÁPIDO ESTÁ LISTO !!!</span>
                        </div>
                        <div class="col-12 row q-mt-md">
                            <div class="col-12 text-xl text-bold">
                                Resultados obtenidos:

                            </div>

                            <div class="col-10 text-lg" :class="color">
                                Nivel de cumplimiendo basico requerido</div>
                            <div class="col-2 text-lg" :class="color">
                                {{ percent }} %
                            </div>

                        </div>
                        <div class="q-mt-xl text-lg">
                            {{ text }}
                        </div>
                        <div class="col-12 row">
                            <div class="col-12 q-mt-md row">
                                <div class="col-12">
                                    <q-icon name="receipt_long" class="q-mx-sm text-primary"/>
                                    <RouterLink class="text-primary" to="/documents">Ver Suscripciones</RouterLink>
                                </div>
                                <div class="col-12 q-mt-md">
                                    <q-icon name="font_download" class="q-mx-sm text-green" />
                                    <RouterLink class="text-green" to="/qualificationClient">Obtener Diagnostico Oficial</RouterLink>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                </div>
                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn color="primary" @click="done2 = true;" label="Finalizar" />
                    </q-stepper-navigation>
                </div>
            </q-step>
        </q-stepper>
    </div>
</template>
<script setup>
import { defineEmits, ref } from 'vue';

const emit = defineEmits(['close-dialog']);

const text = ref('');
const color = ref('text-red');
const percent = ref(0);
const step = ref(1);
const questions = ref([
    { text: '¿Tiene personal capacitado para cumplir con las funciones?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿Cuenta su equipo con certificaciones óptimas?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿Dispone de personal entrenado para las funciones?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿El equipo está debidamente certificado?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿El área de trabajo cumple con las dimensiones necesarias?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿El área de trabajo cumple con el equipo necesario?', cumple: ref(false), noCumple: ref(false) },
    { text: '¿Cuenta con personal de salud?', cumple: ref(false), noCumple: ref(false) }
]);

function close() {
    emit('close-dialog');
}

function updateCheckbox(question, selected, other) {
    if (question[selected]) {
        question[other] = false;
    }
}

/* 

	1.	0 a 60% 
Para resultados bajos:
“Identificaste puntos clave para mejorar. Ahora, profundiza con el diagnóstico oficial y da el paso hacia el cumplimiento priorizado.”

	2.	60% a 80% Para resultados intermedios:
“¡Vas por buen camino! Completa tu progreso con el diagnóstico oficial y asegúrate de cumplir con los estándares exigidos.”
	3.	Más de 80 % 
Para resultados altos:
“¡Gran trabajo! Solo necesitas un diagnóstico oficial de tu cumplimiento para presentarlo con confianza.”

*/

function continueStep() {
    //evaluar cuantas preguntas cumplieron y cuantas no sacar el porcentaje

    const cumple = questions.value.filter((question) => question.cumple).length;
    const total = questions.value.length;
    const porcentajeCumple = (cumple / total) * 100;

    if (porcentajeCumple < 60) {
        text.value = 'Identificaste puntos clave para mejorar. Ahora, profundiza con el diagnóstico oficial y da el paso hacia el cumplimiento priorizado.';
        color.value = 'text-red';
    } else if (porcentajeCumple >= 60 && porcentajeCumple < 80) {
        text.value = '¡Vas por buen camino! Completa tu progreso con el diagnóstico oficial y asegúrate de cumplir con los estándares exigidos.';
        color.value = 'text-yellow-8';
    } else {
        text.value = '¡Gran trabajo! Solo necesitas un diagnóstico oficial de tu cumplimiento para presentarlo con confianza.';
        color.value = 'text-green';
    }
    percent.value = parseInt(porcentajeCumple);

    step.value = 2;
}
</script>
