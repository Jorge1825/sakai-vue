<template>
    <!-- <div class="window-height flex items-center justify-center">
        <div class="justify-center flex row">
            <div class="col-12 justify-center flex">
                <q-img src="../../assets/sosteniweb/logo_negro.png" class="col-span-12" width="30rem" />
            </div>
            <div class="col-12 text-2xl text-bold text-center">Este modulo aún se encuentra en costrucción</div>

        </div>

    </div> -->

    <q-splitter v-model="splitterModel" class="bg-white rounded" style="height: 85vh">
        <template v-slot:before>
            <div class="q-pa-md">
                <q-tree :nodes="simple" node-key="label" selected-color="primary" v-model:selected="selected" default-expand-all />
            </div>
        </template>

        <template v-slot:after>
            <q-tab-panels v-model="selected" animated transition-prev="jump-up" transition-next="jump-up">
                <template v-for="node in flattenNodes(simple)" :key="node.label">
                    <q-tab-panel :name="node.label">
                        <div class="text-h4 q-mb-md" v-if="!['Privada', 'Publica'].includes(node.label)">
                            <q-btn class="q-mx-sm" outline color="primary" type="button" icon="arrow_back" @click="backFolder(node)" />
                        </div>
                        <div class="text-h4 q-mb-md">{{ node.label }}</div>
                        <div v-if="node.children && node.children.length">
                            <div class="row q-gutter-lg">
                                <div v-for="child in node.children" :key="child.label" class="col-11 col-sm-6 col-md-3 col-lg-2 cursor-pointer">
                                    <q-card class="my-card bg-grey-11" flat bordered @click="changeFolder(child)">
                                        <div class="q-pa-sm text-center bg-grey-1">
                                            <div>{{ child.label }}</div>
                                        </div>
                                        <div class="justify-center flex">
                                            <q-icon :name="child.icon || 'description'" size="10rem" class="text-primary" />
                                        </div>
                                        <div class="justify-center flex q-py-sm" v-if="child.type == 'file'">
                                            <q-btn
                                                icon="visibility"
                                                :style="{
                                                    backgroundColor: 'rgb(4, 178, 217)',
                                                    color: 'white'
                                                }"
                                                @click="renderFile(child?.name)"
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
                                                @click="downloadFile(child?.name)"
                                                dense
                                                round
                                            />
                                        </div>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                        <p v-else>
                            {{ node.msgNoData || 'No data available' }}
                        </p>
                    </q-tab-panel>
                </template>
            </q-tab-panels>
        </template>
    </q-splitter>
</template>

<script setup>
import { getFileApi, getFilesApi } from '@/api/files';
import { notifyError } from '@/config/notifications';
import { storeAuth } from '@/store/auth';
import { onBeforeMount, ref } from 'vue';

const useStoreAuth = storeAuth();
let splitterModel = ref(20);
let selected = ref('2.3');

let simple = ref([
    {
        label: 'Privada',
        children: [],
        msgNoData: 'No data available'
    },
    {
        label: 'Publica',
        children: [],
        msgNoData: 'No data available'
    }
]);
let enterprise = ref();

function flattenNodes(nodes) {
    let result = [];
    nodes.forEach((node) => {
        result.push(node);
        if (node.children) {
            result = result.concat(flattenNodes(node.children));
        }
    });
    return result;
}

onBeforeMount(async () => {
    enterprise.value = useStoreAuth.getSelectedCompany();
    await getDataFiles();
});

async function getDataFiles() {
    try {
        const { data } = await getFilesApi(enterprise.value.value);

        simple.value[0].children = data.privateFolders?.map((folder) => {
            return {
                type: 'folder',
                label: folder.name,
                icon: 'folder',
                children: folder.files.map((file) => {
                    return {
                        type: 'file',
                        label: file.originalName,
                        icon: 'description',
                        name: file?.name || '',
                    };
                })
            };
        });

        simple.value[1].children = data.publicFolders?.map((folder) => {
            return {
                type: 'folder',
                label: folder.name,
                icon: 'folder',
                children: folder.files.map((file) => {
                    return {
                        type: 'file',
                        label: file.originalName,
                        icon: 'description',
                        name: file?.name || '',
                    };
                })
            };
        });
    } catch (error) {
        console.log(error);
    }
}

function changeFolder(folder) {
    if (folder.type == 'folder') {
        selected.value = folder.label;
    }
}

function backFolder(folder) {
    //busca el nodo padre
    const parent = flattenNodes(simple.value).find((node) => {
        return node.children?.find((child) => child.label == folder.label);
    });

    selected.value = parent.label;
}

async function renderFile(nameFile) {
    console.log(nameFile);
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

</script>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>
