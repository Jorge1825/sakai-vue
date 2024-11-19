<script setup>
import { storeAuth } from '@/store/auth.js';
import { onBeforeMount, ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

const useStoreAuth = storeAuth();

const role = ref();
const user = ref();
const enterprises = ref();
const enterprise = ref();
onBeforeMount(() => {
    user.value = useStoreAuth.getUserToken();
    role.value = useStoreAuth.getRoleToken();
    enterprises.value = useStoreAuth.getCompanyIds()?.map((enterprise) => {
        return { label: enterprise.name, value: enterprise._id };
    });

    enterprise.value = enterprises.value[0] || null;
    useStoreAuth.setCompany(enterprise.value);
});

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/', users: ['ADMIN', 'USER'] }],
        users: ['ADMIN', 'USER']
    },
    {
        label: 'Administración',
        items: [
            { label: 'Usuarios', icon: 'pi pi-fw pi-id-card', to: '/users', users: ['ADMIN'] },
            { label: 'Roles', icon: 'pi pi-fw pi-list', to: '/roles', users: ['ADMIN'] },
            // { label: 'Requerimientos',icon: 'pi pi-fw pi-file', to: '/requirements, users: ['ADMIN']'},
            { label: 'Prompts', icon: 'pi pi-fw pi-cog', to: '/prompts', users: ['ADMIN'] },
            { label: 'Normas', icon: 'pi pi-fw pi-cog', to: '/norms', users: ['ADMIN', 'USER'] },
            { label: 'Requerimientos', icon: 'pi pi-fw pi-cog', to: '/tablenorm', users: ['ADMIN'] },
            { label: 'Empresas ', icon: 'pi pi-fw pi-cog', to: '/enterprises', users: ['ADMIN'] },
            { label: 'Calificaciones', icon: 'pi pi-fw pi-cog', to: '/qualification', users: ['ADMIN'] },
            { label: 'Calificar Requerimientos', icon: 'pi pi-fw pi-cog', to: 'qualificationClient', users: ['USER'] },
            { label: 'Documentos', icon: 'pi pi-fw pi-cog', to: '/documents', users: ['USER','ADMIN'] }
            // { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout', users: ['ADMIN'] },
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
        ],
        users: ['ADMIN', 'USER']
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
                        users: ['ADMIN', 'USER']
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
                users: ['ADMIN']
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
        users: ['ADMIN']
    }
]);

const changeEnterprise = (value) => {
    useStoreAuth.setCompany(value);
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
            <h1 class="text-center">Bienvenido {{ user.username }}</h1>
            <p class="text-xs text-center q-my-sm">Empresa:</p>
            <q-select rounded outlined bottom-slots dense borderless v-model="enterprise" :options="enterprises" @input="changeEnterprise" />
        </div>
    </ul>
    <ul class="q-mt-lg">
        <router-link to="/" class="flex justify-center items-center gap-1 q-mr-md ani_heartBeat aniUtil_onMouse aniUtil_active aniUtil_onMouseRepeat">
            <img src="/public/demo/images/LogoSosteniweb/sosteniweb manual-23.png" alt="Logo Sosteniweb" width="30" />

            <span>SOSTENIWEB</span>
        </router-link>
    </ul>
</template>

<style lang="scss" scoped></style>
