<script setup>
import { getEnterprisesByIdApi } from '@/api/enterprises';
import { storeAuth } from '@/store/auth.js';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';

const useStoreAuth = storeAuth();
const router = useRouter();

const role = ref();
const user = ref();
const enterprises = ref();
const enterprise = ref();
onBeforeMount(() => {
    user.value = useStoreAuth.getUserToken();
    role.value = useStoreAuth.getRoleToken();
    enterprises.value = useStoreAuth.getCompanyIds()?.map((enterprise) => {
        return { label: enterprise.name, value: enterprise._id, firstDiagnostic: enterprise.firstDiagnostic };
    });

    let enterpriseLocal = localStorage.getItem('selectedCompany') || null;
    enterpriseLocal = enterpriseLocal ? JSON.parse(enterpriseLocal) : null;

    enterprise.value =  enterpriseLocal || enterprises.value[0] || null;
    useStoreAuth.setCompany(enterprise.value);
    useStoreAuth.setFirstDiagnostic(enterprise.value.firstDiagnostic);
});

const itemsFull = [
            { label: 'Empresas ', icon: 'pi pi-fw pi-cog', to: '/enterprises', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 1, orderUser: 0 },
            { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/users', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 2, orderUser: 0 },
            { label: 'Roles', icon: 'pi pi-fw pi-list', to: '/roles', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 3, orderUser: 0 },
            // { label: 'Requerimientos',icon: 'pi pi-fw pi-file', to: '/requirements, users: ['ADMIN','SUPERADMIN']'},
            { label: 'Normas', icon: 'pi pi-fw pi-cog', to: '/norms', users: ['ADMIN', 'SUPERADMIN', 'USER'], orderAdmin: 4, orderUser: 1 },
            { label: 'Evaluaciones Express', icon: 'pi pi-fw pi-cog', to: '/express', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 5, orderUser: 0 },
            { label: 'Calificaciones', icon: 'pi pi-fw pi-cog', to: '/qualification', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 6, orderUser: 0 },
            { label: 'Documentos', icon: 'pi pi-fw pi-cog', to: '/documents', users: ['USER', 'ADMIN', 'SUPERADMIN'], orderAdmin: 7, orderUser: 4 },
            { label: 'Plan de trabajo', icon: 'pi pi-fw pi-cog', to: '/WorkPlans', users: ['USER', 'ADMIN', 'SUPERADMIN'], orderAdmin: 8, orderUser: 5 },
            { label: 'Programas', icon: 'pi pi-fw pi-cog', to: '/programs', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 9, orderUser: 0 },
            { label: 'Prompts', icon: 'pi pi-fw pi-cog', to: '/prompts', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 10, orderUser: 0 },
            { label: 'Requerimientos', icon: 'pi pi-fw pi-cog', to: '/tablenorm', users: ['ADMIN', 'SUPERADMIN'], orderAdmin: 11, orderUser: 2 },
            { label: 'Autoevaluación', icon: 'pi pi-fw pi-cog', to: 'qualificationClient', users: ['USER'], orderAdmin: 12, orderUser: 2 },
            // { label: 'Sugerencia de evidencias', icon: 'pi pi-fw pi-cog', to: '/suggestedEvidences', users: ['ADMIN', 'SUPERADMIN'] },
            { label: 'Diagnostico', icon: 'pi pi-fw pi-cog', to: '/diagnostic', users: ['USER', 'ADMIN', 'SUPERADMIN'], orderAdmin: 13, orderUser: 3 }
            // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout', users: ['ADMIN','SUPERADMIN'] },
            // { label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            // { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            // { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            // { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            // { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            // { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            // { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            // { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            // { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu' },
            // { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            // { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            // { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            // { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/uikit/timeline' },
            // { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
        ]

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', users: ['ADMIN', 'SUPERADMIN', 'USER'] }],
        users: ['ADMIN', 'SUPERADMIN', 'USER']
    },
    {
        label: 'Administración',
        items: itemsFull.sort((a, b) => a.orderUser - b.orderUser),

        users: ['ADMIN', 'SUPERADMIN', 'USER']
    },
    {
        label: 'Pages',
        icon: 'pi pi-fw pi-briefcase',
        to: '/pages',
        items: [
            // {
            // label: 'Landing',
            // icon: 'pi pi-fw pi-globe',
            // to: '/landing'
            // },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        to: '/auth/login',
                        users: ['ADMIN', 'SUPERADMIN', 'USER']
                    }
                    // {
                    // label: 'Error',
                    // icon: 'pi pi-fw pi-times-circle',
                    // to: '/auth/error'
                    // },
                    // {
                    // label: 'Access Denied',
                    // icon: 'pi pi-fw pi-lock',
                    // to: '/auth/access'
                    // }
                ],
                users: ['ADMIN', 'SUPERADMIN']
            }
            // {
            // label: 'Crud',
            // icon: 'pi pi-fw pi-pencil',
            // to: '/pages/crud'
            // },
            // {
            // label: 'Not Found',
            // icon: 'pi pi-fw pi-exclamation-circle',
            // to: '/pages/notfound'
            // },
            // {
            // label: 'Empty',
            // icon: 'pi pi-fw pi-circle-off',
            // to: '/pages/empty'
            // }
        ],
        users: ['ADMIN', 'SUPERADMIN']
    }
]);

const changeEnterprise = async () => {
    try {
        const response = await getEnterprisesByIdApi(enterprise.value.value);
        useStoreAuth.setCompany({
            label: response.data.name,
            value: response.data._id,
            firstDiagnostic: response.data.firstDiagnostic
        });

        console.log(response.data.firstDiagnostic);

        await useStoreAuth.setFirstDiagnostic(response.data.firstDiagnostic);
        router.push({ path: '/' });
        window.location.reload();
    } catch (error) {
        console.log(error);
    }
};
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <template v-if="item.users.includes(role?.type)">
                <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
                <li v-if="item.separator" class="menu-separator"></li>
            </template>
        </template>
        <div class="q-py-md" v-if="role?.type === 'USER'">
            <h1 class="text-center">Bienvenid@ {{ user.username }}</h1>
            <p class="text-xs text-center q-my-sm">Empresa:</p>
            <q-select rounded outlined bottom-slots dense borderless v-model="enterprise" :options="enterprises" @update:model-value="changeEnterprise()" />
        </div>
    </ul>
    <ul class="q-mt-lg">
        <router-link to="/" class="flex justify-center items-center gap-1 q-mr-md ani_heartBeat aniUtil_onMouse aniUtil_active aniUtil_onMouseRepeat">
            <img src="../assets/sosteniweb/logo_negro.png" alt="Logo Sosteniweb" width="30" />

            <span>SOSTENIWEB</span>
        </router-link>
    </ul>
</template>

<style lang="scss" scoped></style>
