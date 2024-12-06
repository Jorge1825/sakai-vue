<template>
    <div class="text-h6 text-center text-primary q-my-md" style="font-weight: bold; font-size: 24px"> 
        
        EVALUACIÓN EXPRESS DE CUMPLIMIENTO

    </div>
    <div class="q-pa-md full-width">
        <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
            <q-step :name="1" title="Pregunta 1" icon="settings" :done="step > 1" :header-nav="step > 1">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[0].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn flat color="primary" @click="" label="Omitir" class="q-mx-md" />
                        <q-btn
                            @click="
                                () => {
                                    done1 = true;
                                    step = 2;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />

                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done1" :name="2" title="Pregunta 2" icon="create_new_folder" :done="step > 2" :header-nav="step > 2">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[1].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done2 = true;
                                    step = 3;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done2" :name="3" title="Pregunta 3" icon="create_new_folder" :done="step > 3" :header-nav="step > 3">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[2].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done3 = true;
                                    step = 4;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done3" :name="4" title="Pregunta 4" icon="create_new_folder" :done="step > 4" :header-nav="step > 4">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[3].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done4 = true;
                                    step = 5;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done4" :name="5" title="Pregunta 5" icon="create_new_folder" :done="step > 5" :header-nav="step > 5">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[4].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done5 = true;
                                    step = 6;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done5" :name="6" title="Pregunta 6" icon="create_new_folder" :done="step > 6" :header-nav="step > 6">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[5].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done6 = true;
                                    step = 7;
                                }
                            "
                            color="primary"
                            label="Continuar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step v-if="done6" :name="7" title="Pregunta 7" icon="create_new_folder" :done="step > 7" :header-nav="step > 7">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl">
                                {{ questions[6].question }}
                            </span>
                        </div>
                        <div class="col-12">
                            <q-option-group :options="options" type="radio" v-model="group" />
                        </div>
                    </div>
                </div>

                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn
                            @click="
                                () => {
                                    done7 = true;
                                    step = 8;
                                }
                            "
                            color="primary"
                            label="Evaluar"
                        />
                    </q-stepper-navigation>
                </div>
            </q-step>

            <q-step :name="8" title="Diagnostico" icon="add_comment" :header-nav="step > 8">
                <div class="row full-width q-my-lg">
                    <div class="col-5 row justify-center flex">
                        <div class="col-12 justify-center flex">
                            <q-img src="../assets/sosteniweb/logo_negro.png" spinner-color="white" style="width: 10rem; height: 10rem; opacity: 0.2" />
                        </div>
                        <span class="text-2xl text-gray-400 col-12 text-center">Sosteniweb Colombia</span>
                    </div>
                    <div class="col-7 row">
                        <div class="col-12">
                            <span class="text-xl"> AQUI VA EL DIAGNOSTICO </span>
                        </div>
                    </div>
                </div>
                <div class="row justify-end flex">
                    <q-stepper-navigation>
                        <q-btn color="primary" @click="done3 = true" label="Finalizar" />
                    </q-stepper-navigation>
                </div>
            </q-step>
        </q-stepper>
    </div>
</template>
<script setup>
import { ref } from 'vue';

const step = ref(1);
let group = ref();
let options = ref([
    {
        label: 'Si Cumple',
        value: true
    },
    {
        label: 'No Cumple',
        value: false
    }
]);

let questions = ref([
    {
        question: '¿Cuál es tu nombre?',
        answer: false
    },
    {
        question: '¿Cuál es tu edad?',
        answer: false
    },
    {
        question: '¿Cuál es tu género?',
        answer: false
    },
    {
        question: '¿Cuál es tu dirección?',
        answer: false
    },
    {
        question: '¿Cuál es tu número de teléfono?',
        answer: false
    },
    {
        question: '¿Cuál es tu correo electrónico?',
        answer: false
    },
    {
        question: '¿Cuál es tu ocupación?',
        answer: false
    }
]);
</script>
