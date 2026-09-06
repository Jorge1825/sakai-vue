<template>
    <div class="col-span-12">
        <div class="card full-height" style="min-height: 82vh">
            <!-- barra superior -->
            <div class="row items-center q-pa-md q-gutter-sm">
                <div class="text-h5" style="color: rgb(4, 178, 217); text-transform: uppercase">
                    <strong>DOCUMENTOS</strong>
                </div>
                <q-space />
                <q-input
                    v-model="searchText"
                    dense
                    outlined
                    debounce="300"
                    clearable
                    placeholder="Buscar archivo..."
                    style="min-width: 240px"
                >
                    <template v-slot:prepend>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn
                    v-if="canModify && currentNodeWritable"
                    label="Subir archivos"
                    icon="upload_file"
                    unelevated
                    no-caps
                    :disable="!currentFolderId"
                    :style="{ backgroundColor: 'rgb(4, 178, 217)', color: 'white' }"
                    @click="openUpload"
                >
                    <q-tooltip v-if="!currentFolderId">Entra a una carpeta para subir archivos</q-tooltip>
                </q-btn>
                <q-btn
                    v-if="canModify && currentNodeWritable"
                    label="Nueva carpeta"
                    icon="create_new_folder"
                    unelevated
                    no-caps
                    outline
                    style="color: rgb(4, 178, 217)"
                    @click="folderDialog = true"
                />
            </div>

            <!-- breadcrumb -->
            <div class="q-px-md q-pb-sm">
                <q-breadcrumbs active-color="primary">
                    <q-breadcrumbs-el
                        v-for="(crumb, index) in breadcrumb"
                        :key="index"
                        :label="crumb.label"
                        :icon="crumb.icon"
                        :class="{ 'cursor-pointer': index < breadcrumb.length - 1 }"
                        @click="goToCrumb(index)"
                    />
                </q-breadcrumbs>
            </div>
            <q-separator />

            <q-inner-loading :showing="loading">
                <q-spinner size="40px" color="primary" />
            </q-inner-loading>

            <div class="q-pa-md" style="min-height: 55vh">
                <!-- modo búsqueda -->
                <template v-if="searchText">
                    <div class="text-subtitle1 q-mb-md">{{ searchResults.length }} resultado(s) para "{{ searchText }}"</div>
                    <div v-if="searchResults.length" class="row q-gutter-md">
                        <div v-for="item in searchResults" :key="item.file._id" class="col-11 col-sm-6 col-md-3 col-lg-2">
                            <q-card class="my-card bg-grey-11" flat bordered>
                                <div class="q-pa-sm text-center bg-grey-1 ellipsis" :title="item.file.originalName">
                                    <div>{{ item.file.originalName }}</div>
                                </div>
                                <div class="justify-center flex">
                                    <q-icon :name="iconFor(item.file.mimetype)" size="6rem" :color="colorFor(item.file.mimetype)" />
                                </div>
                                <div class="q-px-sm text-caption text-grey-7 ellipsis" :title="item.locationPath">
                                    {{ item.locationPath }}
                                </div>
                                <div class="justify-center flex q-py-sm">
                                    <q-btn icon="visibility" :style="btnStyle" @click="openPreview(item.file)" dense round class="q-mr-md" />
                                    <q-btn icon="cloud_download" :style="btnStyle" @click="downloadFile(item.file)" dense round />
                                </div>
                            </q-card>
                        </div>
                    </div>
                    <div v-else class="text-grey-7">No se encontraron archivos con ese nombre.</div>
                </template>

                <!-- modo explorador -->
                <template v-else>
                    <!-- raíz privada: zona pública destacada + privado -->
                    <template v-if="currentZone === 'private' && !currentFolderId">
                        <q-banner rounded class="bg-blue-1 text-primary q-mb-md">
                            <template v-slot:avatar>
                                <q-icon name="public" color="primary" />
                            </template>
                            <div class="text-subtitle1 text-bold">Zona pública</div>
                            <div class="text-caption">Documentos visibles para todas las empresas.</div>
                        </q-banner>
                        <div v-if="publicRoots.length" class="row q-gutter-md q-mb-lg">
                            <div v-for="folder in publicRoots" :key="folder._id" class="col-11 col-sm-6 col-md-3 col-lg-2">
                                <q-card class="my-card cursor-pointer" flat bordered @click="enterPublicFolder(folder)">
                                    <div class="q-pa-sm text-center bg-grey-1 ellipsis" :title="folder.name">
                                        <div>{{ folder.name }}</div>
                                    </div>
                                    <div class="justify-center flex">
                                        <q-icon name="folder" size="6rem" color="amber-8" />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                        <div v-else class="text-caption text-grey-7 q-mb-lg">Sin carpetas públicas.</div>
                        <q-separator class="q-mb-md" />
                        <div class="text-h6 q-mb-md">
                            {{ isSuperadmin ? 'Empresas' : currentEnterprise?.name || 'Privado' }}
                        </div>
                    </template>

                    <!-- superadmin sin empresa elegida: grid de empresas -->
                    <template v-if="isSuperadmin && currentZone === 'private' && !currentEnterpriseId">
                        <div v-if="enterprisesData.length" class="row q-gutter-md">
                            <div v-for="entry in enterprisesData" :key="entry.enterprise._id" class="col-11 col-sm-6 col-md-3 col-lg-2">
                                <q-card class="my-card cursor-pointer" flat bordered @click="selectEnterprise(entry.enterprise._id)">
                                    <div class="q-pa-sm text-center bg-grey-1 ellipsis" :title="entry.enterprise.name">
                                        <div>{{ entry.enterprise.name }}</div>
                                    </div>
                                    <div class="justify-center flex">
                                        <q-icon name="apartment" size="6rem" color="primary" />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                        <div v-else class="text-grey-7">No hay empresas con carpetas de documentos.</div>
                    </template>

                    <!-- navegación normal: carpetas + archivos -->
                    <template v-else>
                        <div v-if="currentChildren.length" class="row q-gutter-md">
                            <div v-for="folder in currentChildren" :key="folder._id" class="col-11 col-sm-6 col-md-3 col-lg-2">
                                <q-card class="my-card cursor-pointer" flat bordered @click="enterFolder(folder)">
                                    <div class="q-pa-sm text-center bg-grey-1 ellipsis" :title="folder.name">
                                        <div>{{ folder.name }}</div>
                                    </div>
                                    <div class="justify-center flex">
                                        <q-icon name="folder" size="6rem" color="amber-8" />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                        <div v-if="currentFiles.length" class="row q-gutter-md" :class="{ 'q-mt-md': currentChildren.length }">
                            <div v-for="file in currentFiles" :key="file._id" class="col-11 col-sm-6 col-md-3 col-lg-2">
                                <q-card class="my-card bg-grey-11" flat bordered>
                                    <div class="q-pa-sm text-center bg-grey-1 ellipsis" :title="file.originalName">
                                        <div>{{ file.originalName }}</div>
                                    </div>
                                    <div class="justify-center flex">
                                        <q-icon :name="iconFor(file.mimetype)" size="6rem" :color="colorFor(file.mimetype)" />
                                    </div>
                                    <div class="justify-center flex q-py-sm">
                                        <q-btn icon="visibility" :style="btnStyle" @click="openPreview(file)" dense round class="q-mr-md" />
                                        <q-btn icon="cloud_download" :style="btnStyle" @click="downloadFile(file)" dense round />
                                    </div>
                                </q-card>
                            </div>
                        </div>
                        <div
                            v-if="!currentChildren.length && !currentFiles.length"
                            class="text-grey-7"
                        >
                            {{ currentFolderId ? 'Carpeta vacía.' : 'No hay documentos disponibles.' }}
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </div>

    <!-- preview modal -->
    <q-dialog v-model="previewOpen" maximized @hide="closePreview">
        <q-card class="column">
            <q-bar class="bg-primary text-white">
                <q-icon name="insert_drive_file" />
                <div class="ellipsis q-ml-sm">{{ previewFile?.originalName }}</div>
                <q-space />
                <q-btn dense flat icon="cloud_download" @click="downloadFile(previewFile)">
                    <q-tooltip>Descargar</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" v-close-popup />
            </q-bar>
            <q-card-section class="col flex flex-center bg-grey-2">
                <div v-if="previewLoading" class="flex flex-center" style="width: 100%; height: 100%">
                    <q-spinner size="48px" color="primary" />
                </div>
                <iframe
                    v-else-if="previewIsPdf"
                    :src="previewUrl"
                    style="width: 100%; height: 100%; border: none; background: white"
                />
                <q-img
                    v-else-if="previewIsImage"
                    :src="previewUrl"
                    fit="contain"
                    style="max-width: 90vw; max-height: 85vh"
                />
                <div v-else class="text-center">
                    <q-icon name="visibility_off" size="5rem" color="grey-7" />
                    <div class="text-subtitle1 q-mt-md">Vista previa no disponible para este tipo de archivo.</div>
                    <q-btn
                        class="q-mt-md"
                        label="Descargar archivo"
                        icon="cloud_download"
                        unelevated
                        :style="btnStyle"
                        @click="downloadFile(previewFile)"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

    <!-- dialog upload -->
    <q-dialog v-model="uploadOpen" persistent>
        <q-card style="min-width: 420px; max-width: 90vw">
            <q-card-section>
                <div class="text-h6 text-primary">Subir archivos</div>
                <div class="text-caption text-grey-7">
                    Destino: {{ currentZone === 'public' ? 'Zona pública' : 'Privado' }} / {{ breadcrumbPath }}
                </div>
            </q-card-section>
            <q-card-section>
                <div class="row justify-center flex q-gutter-sm">
                    <template v-for="(file, index) in selectedFiles" :key="index">
                        <q-chip removable @remove="selectedFiles.splice(index, 1)">
                            <q-icon name="attachment" />
                            <div class="q-chip-main ellipsis">{{ file?.name }}</div>
                        </q-chip>
                    </template>
                    <template v-if="!selectedFiles.length"> No se ha seleccionado un archivo </template>
                </div>
                <div class="justify-center flex q-mt-sm">
                    <input
                        multiple
                        type="file"
                        id="documentsFileInput"
                        @change="onFilesSelected"
                        style="display: none"
                        accept=".pdf,.txt,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx"
                    />
                    <q-btn outline label="Seleccionar archivos" icon="attach_file" style="color: rgb(4, 178, 217)" @click="pickFiles" />
                </div>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn outline label="Cancelar" color="negative" @click="hideUpload" />
                <q-btn
                    unelevated
                    label="Subir"
                    icon="cloud_upload"
                    :loading="uploading"
                    :disable="!selectedFiles.length"
                    :style="btnStyle"
                    @click="submitUpload"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- dialog nueva carpeta -->
    <q-dialog v-model="folderDialog" persistent>
        <q-card style="min-width: 380px">
            <q-card-section>
                <div class="text-h6 text-primary">Nueva carpeta</div>
                <div class="text-caption text-grey-7">
                    Ubicación: {{ currentZone === 'public' ? 'Zona pública' : 'Privado' }} / {{ breadcrumbPath }}
                </div>
            </q-card-section>
            <q-card-section>
                <q-input
                    v-model="newFolderName"
                    outlined
                    dense
                    label="Nombre de la carpeta"
                    :rules="[(val) => (val && val.trim().length > 0) || 'Nombre requerido']"
                    @keyup.enter="submitFolder"
                />
            </q-card-section>
            <q-card-actions align="right">
                <q-btn outline label="Cancelar" color="negative" v-close-popup />
                <q-btn unelevated label="Crear" icon="create_new_folder" :loading="creatingFolder" :style="btnStyle" @click="submitFolder" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { computed, onBeforeMount, ref } from 'vue';
import { createFolderApi, getFileApi, getFilesApi, saveFileApi } from '@/api/files';
import { notifyError, notifySuccess } from '@/config/notifications';
import { storeAuth } from '@/store/auth';

const useStoreAuth = storeAuth();

const btnStyle = { backgroundColor: 'rgb(4, 178, 217)', color: 'white' };

// ---- estado ----
let loading = ref(false);
let scope = ref('enterprise'); // 'enterprise' | 'all'
let enterprisesData = ref([]); // [{ enterprise: {_id, name}, tree }]
let publicTree = ref([]);
let privateTree = ref([]); // árbol de la empresa actual (scope enterprise)
let currentZone = ref('private'); // 'private' | 'public'
let currentEnterpriseId = ref(null); // superadmin navegando empresas
let scopeEnterprise = ref(null); // { _id, name } cuando scope enterprise
let currentFolderId = ref(null); // null = raíz de zona
let searchText = ref('');

// preview
let previewOpen = ref(false);
let previewLoading = ref(false);
let previewFile = ref(null);
let previewUrl = ref('');

// upload / carpeta
let uploadOpen = ref(false);
let selectedFiles = ref([]);
let uploading = ref(false);
let folderDialog = ref(false);
let newFolderName = ref('');
let creatingFolder = ref(false);

const role = computed(() => useStoreAuth.getRoleToken());
const roleType = computed(() => role.value?.type || 'USER');
const isSuperadmin = computed(() => roleType.value === 'SUPERADMIN');
const canModify = computed(() => ['ADMIN', 'SUPERADMIN'].includes(roleType.value));

// ---- árbol / navegación ----
function flatten(nodes, acc = [], meta = {}) {
    for (const node of nodes) {
        const tagged = { ...node, __zone: meta.zone, __enterpriseId: meta.enterpriseId };
        acc.push(tagged);
        if (node.children?.length) flatten(node.children, acc, meta);
    }
    return acc;
}

const allNodes = computed(() => {
    const nodes = [];
    if (scope.value === 'all') {
        for (const entry of enterprisesData.value) {
            flatten(entry.tree, nodes, { zone: 'private', enterpriseId: entry.enterprise._id });
        }
    } else {
        flatten(privateTree.value, nodes, { zone: 'private', enterpriseId: scopeEnterprise.value?._id });
    }
    flatten(publicTree.value, nodes, { zone: 'public', enterpriseId: null });
    return nodes;
});

const folderMap = computed(() => new Map(allNodes.value.map((n) => [String(n._id), n])));

const publicRoots = computed(() => publicTree.value);
const currentEnterprise = computed(() => {
    if (scope.value === 'all') {
        return enterprisesData.value.find((e) => String(e.enterprise._id) === String(currentEnterpriseId.value))?.enterprise || null;
    }
    return scopeEnterprise.value;
});

const currentNode = computed(() => (currentFolderId.value ? folderMap.value.get(String(currentFolderId.value)) : null));

const currentChildren = computed(() => {
    if (currentNode.value) return currentNode.value.children || [];
    if (currentZone.value === 'public') return publicTree.value;
    if (scope.value === 'all') {
        const entry = enterprisesData.value.find((e) => String(e.enterprise._id) === String(currentEnterpriseId.value));
        return entry?.tree || [];
    }
    return privateTree.value;
});

const currentFiles = computed(() => currentNode.value?.files || []);

// puede escribir en la ubicación actual (solo oculta botones; el backend valida)
const currentNodeWritable = computed(() => {
    if (!canModify.value) return false;
    if (currentZone.value === 'public') return isSuperadmin.value;
    // privado: admin solo en su empresa (scope enterprise); superadmin siempre
    return scope.value === 'enterprise' ? true : isSuperadmin.value;
});

const breadcrumb = computed(() => {
    const crumbs = [];
    if (currentZone.value === 'public') {
        crumbs.push({ label: 'Zona pública', icon: 'public' });
    } else {
        if (scope.value === 'all') {
            crumbs.push({ label: 'Empresas', icon: 'apartment' });
            if (currentEnterprise.value) crumbs.push({ label: currentEnterprise.value.name, icon: 'business' });
        } else if (scopeEnterprise.value) {
            crumbs.push({ label: scopeEnterprise.value.name, icon: 'business' });
        }
    }
    // cadena de carpetas (con referencia al nodo para navegación)
    const chain = [];
    let node = currentNode.value;
    while (node) {
        chain.unshift({ label: node.name, icon: 'folder', node });
        node = node.idParent ? folderMap.value.get(String(node.idParent)) : null;
    }
    return [...crumbs, ...chain];
});

const breadcrumbPath = computed(() => breadcrumb.value.map((c) => c.label).join(' / '));

// ---- búsqueda ----
function locationPathFor(node) {
    const parts = [];
    let current = node;
    while (current) {
        parts.unshift(current.name);
        current = current.idParent ? folderMap.value.get(String(current.idParent)) : null;
    }
    const prefix =
        node.__zone === 'public'
            ? 'Zona pública'
            : findEnterpriseName(node.__enterpriseId);
    return [prefix, ...parts].join(' / ');
}

function findEnterpriseName(id) {
    if (!id) return '';
    if (scope.value === 'enterprise') return scopeEnterprise.value?.name || '';
    return enterprisesData.value.find((e) => String(e.enterprise._id) === String(id))?.enterprise?.name || '';
}

const searchResults = computed(() => {
    const term = (searchText.value || '').trim().toLowerCase();
    if (!term) return [];
    const results = [];
    for (const node of allNodes.value) {
        for (const file of node.files || []) {
            if (String(file.originalName || '').toLowerCase().includes(term)) {
                results.push({ file, locationPath: locationPathFor(node) });
            }
        }
    }
    return results.slice(0, 60);
});

// ---- carga ----
onBeforeMount(async () => {
    await loadData();
});

async function loadData() {
    loading.value = true;
    try {
        let target = 'all';
        if (!isSuperadmin.value) {
            target =
                useStoreAuth.getSelectedCompany()?.value ||
                useStoreAuth.dataToken?.enterprises?.[0]?._id ||
                null;
            if (!target) {
                notifyError({ message: 'No tienes empresas asignadas.' });
                return;
            }
        }

        const { data } = await getFilesApi(target);
        scope.value = data.scope;
        publicTree.value = data.publicTree || [];
        if (data.scope === 'all') {
            enterprisesData.value = data.enterprises || [];
            scopeEnterprise.value = null;
            currentEnterpriseId.value = null;
        } else {
            scopeEnterprise.value = data.enterprise;
            privateTree.value = data.privateTree || [];
            currentEnterpriseId.value = data.enterprise?._id || null;
        }
        // reset navegación
        currentZone.value = 'private';
        currentFolderId.value = null;
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al cargar los documentos.' });
    } finally {
        loading.value = false;
    }
}

// ---- navegación ----
function selectEnterprise(id) {
    currentEnterpriseId.value = id;
    currentFolderId.value = null;
    currentZone.value = 'private';
}

function enterFolder(folder) {
    currentFolderId.value = folder._id;
}

function enterPublicFolder(folder) {
    currentZone.value = 'public';
    currentFolderId.value = folder._id;
}

function goToCrumb(index) {
    if (index === breadcrumb.value.length - 1) return; // crumb actual
    const target = breadcrumb.value[index];

    if (target.node) {
        currentZone.value = target.node.__zone;
        currentFolderId.value = target.node._id;
        return;
    }
    if (target.icon === 'public') {
        currentZone.value = 'public';
        currentFolderId.value = null;
        return;
    }
    if (target.icon === 'apartment') {
        currentZone.value = 'private';
        currentEnterpriseId.value = null;
        currentFolderId.value = null;
        return;
    }
    if (target.icon === 'business') {
        currentZone.value = 'private';
        currentFolderId.value = null;
        return;
    }
}

// ---- iconos ----
function iconFor(mimetype) {
    const mt = String(mimetype || '');
    if (mt === 'application/pdf') return 'picture_as_pdf';
    if (mt.startsWith('image/')) return 'image';
    if (mt.includes('word') || mt.includes('document')) return 'description';
    if (mt.includes('sheet') || mt.includes('excel') || mt.includes('csv')) return 'table_view';
    return 'insert_drive_file';
}

function colorFor(mimetype) {
    const mt = String(mimetype || '');
    if (mt === 'application/pdf') return 'red-7';
    if (mt.startsWith('image/')) return 'green-7';
    if (mt.includes('word') || mt.includes('document')) return 'blue-7';
    if (mt.includes('sheet') || mt.includes('excel') || mt.includes('csv')) return 'green-8';
    return 'grey-7';
}

// ---- preview / descarga ----
const previewIsPdf = computed(() => previewFile.value?.mimetype === 'application/pdf');
const previewIsImage = computed(() => String(previewFile.value?.mimetype || '').startsWith('image/'));

async function openPreview(file) {
    if (!file?.name) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    previewFile.value = file;
    previewOpen.value = true;
    previewLoading.value = true;
    try {
        const response = await getFileApi(file.name);
        if (response.status <= 300) {
            previewUrl.value = URL.createObjectURL(response.data);
        } else {
            notifyError({ message: 'Error al obtener el archivo.' });
            previewOpen.value = false;
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al obtener el archivo.' });
        previewOpen.value = false;
    } finally {
        previewLoading.value = false;
    }
}

function closePreview() {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value);
        previewUrl.value = '';
    }
    previewFile.value = null;
}

async function downloadFile(file) {
    if (!file?.name) {
        notifyError({ message: 'No se ha seleccionado un archivo.' });
        return;
    }
    try {
        const response = await getFileApi(file.name);
        if (response.status <= 300) {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.originalName || file.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            notifyError({ message: 'Error al obtener el archivo.' });
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al obtener el archivo.' });
    }
}

// ---- upload ----
function openUpload() {
    if (!currentFolderId.value) {
        notifyError({ message: 'Entra a una carpeta para subir archivos.' });
        return;
    }
    selectedFiles.value = [];
    uploadOpen.value = true;
}

function hideUpload() {
    uploadOpen.value = false;
    selectedFiles.value = [];
}

function pickFiles() {
    document.getElementById('documentsFileInput').click();
}

function onFilesSelected(event) {
    selectedFiles.value = [...event.target.files];
    event.target.value = '';
}

// recarga manteniendo la ubicación actual (tras subir/crear dentro de una carpeta)
async function reloadHere() {
    const zone = currentZone.value;
    const enterpriseId = currentEnterpriseId.value;
    const folderId = currentFolderId.value;
    await loadData();
    currentZone.value = zone;
    if (scope.value === 'all') currentEnterpriseId.value = enterpriseId;
    currentFolderId.value = folderId && folderMap.value.has(String(folderId)) ? folderId : null;
}

async function submitUpload() {
    if (!selectedFiles.value.length) return;
    uploading.value = true;
    try {
        const formData = new FormData();
        selectedFiles.value.forEach((file) => formData.append('files', file));
        formData.append('folderId', currentFolderId.value);

        const response = await saveFileApi(formData);
        if (response.status <= 300) {
            notifySuccess({ message: 'Archivos subidos correctamente.' });
            hideUpload();
            await reloadHere();
        } else {
            notifyError({ message: 'Error al subir los archivos.' });
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: 'Error al subir los archivos.' });
    } finally {
        uploading.value = false;
    }
}

// ---- nueva carpeta ----
async function submitFolder() {
    const name = (newFolderName.value || '').trim();
    if (!name) {
        notifyError({ message: 'Escribe un nombre para la carpeta.' });
        return;
    }
    creatingFolder.value = true;
    try {
        const payload = {
            name,
            idParent: currentFolderId.value || undefined,
        };
        if (!currentFolderId.value) {
            // raíz: hay que declarar zona/empresa (el backend hereda si hay padre)
            if (currentZone.value === 'public') {
                payload.availability = 'public';
            } else {
                payload.availability = 'private';
                payload.enterprise = String(currentEnterpriseId.value || scopeEnterprise.value?._id);
                if (!payload.enterprise) {
                    notifyError({ message: 'Selecciona una empresa primero.' });
                    creatingFolder.value = false;
                    return;
                }
            }
        }

        const response = await createFolderApi(payload);
        if (response.status <= 300) {
            notifySuccess({ message: 'Carpeta creada correctamente.' });
            folderDialog.value = false;
            newFolderName.value = '';
            await reloadHere();
        } else {
            notifyError({ message: response.data?.error || 'Error al crear la carpeta.' });
        }
    } catch (error) {
        console.error(error);
        notifyError({ message: error?.response?.data?.error || 'Error al crear la carpeta.' });
    } finally {
        creatingFolder.value = false;
    }
}
</script>

<style scoped>
.my-card {
    cursor: pointer;
    transition: box-shadow 0.2s ease;
}
.my-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
