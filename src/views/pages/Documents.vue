<template>
    <!-- <div class="window-height flex items-center justify-center">
        <div class="justify-center flex row">
            <div class="col-12 justify-center flex">
                <q-img src="../../assets/sosteniweb/logo_negro.png" class="col-span-12" width="30rem" />
            </div>
            <div class="col-12 text-2xl text-bold text-center">Este modulo aún se encuentra en costrucción</div>

        </div>

    </div> -->
 


    <q-splitter v-model="splitterModel" class="bg-white rounded " style="height: 85vh;">
        <template v-slot:before>
            <div class="q-pa-md">
                <q-tree :nodes="simple" node-key="label" selected-color="primary" v-model:selected="selected" default-expand-all />
            </div>
        </template>

        <template v-slot:after>
            <q-tab-panels v-model="selected" animated transition-prev="jump-up" transition-next="jump-up">
                <template v-for="node in flattenNodes(simple)" :key="node.label">
                    <q-tab-panel :name="node.label">
                        <div class="text-h4 q-mb-md">{{ node.label }}</div>
                        <div v-if="node.children && node.children.length">
                            <div class="row q-gutter-lg">
                                <div v-for="child in node.children" :key="child.label" class="col-6 col-md-3 col-lg-2 cursor-pointer">
                                    <q-card class="my-card bg-grey-11" flat bordered>
                                        <div class="q-pa-sm text-center bg-grey-1">
                                            <div>{{ child.label }}</div>
                                        </div>
                                        <div class="justify-center flex">
                                            <q-icon :name="child.icon || 'description'" size="10rem" class="text-primary" />
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
import { getFilesApi } from '@/api/files';
import { onBeforeMount, ref } from 'vue';

let splitterModel = ref(20);
let selected = ref('Food');

let simple = ref([
    {
        label: 'Privada',
        children: [
            {
                label: 'Food',
                icon: 'restaurant_menu'
            },
            {
                label: 'Room service',
                icon: 'room_service'
            },
            {
                label: 'Room view',
                icon: 'photo'
            },
            {
                label: 'Good service (disabled node with icon)',
                icon: 'room_service',
                children: [
                    {
                        label: 'test',
                        icon: 'room_service',
                        children: [
                            {
                                label: 'gfdgfdgfdg',
                                icon: 'room_service',
                                children: [{ label: 'ggggg', icon: 'room_service' }, { label: 'Professional d' }]
                            },
                            { label: 'Professional f' }
                        ]
                    },
                    { label: 'Professional 2q' }
                ]
            }
        ],
        msgNoData: 'No data available'
    },
    {
        label: 'Publica',
        children: [
            {
                label: 'Food',
                icon: 'restaurant_menu'
            },
            {
                label: 'Room service',
                icon: 'room_service'
            },
            {
                label: 'Room view',
                icon: 'photo'
            },
            {
                label: 'Good service (disabled node with icon)',
                icon: 'room_service',
                children: [
                    {
                        label: 'test',
                        icon: 'room_service',
                        children: [
                            {
                                label: 'gfdgfdgfdg',
                                icon: 'room_service',
                                children: [{ label: 'ggggg', icon: 'room_service' }, { label: 'Professional d' }]
                            },
                            { label: 'Professional f' }
                        ]
                    },
                    { label: 'Professional 2q' }
                ]
            }
        ],
        msgNoData: 'No data available'
    }
]);

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
    await getDataFiles();
});

async function getDataFiles() {
    /* 
    {
    publicFolders: [],
    privateFolders: [
      {
        _id: '677f42693167af60387be217',
        name: 'RESOLUCIÓN 0312',
        path: 'uploads/677db103e9c6905425ea1bec/6724ccc736a2e8c68d2c27fa',
        idParent: '677db103e9c6905425ea1bec',
        availability: 'private',
        user: '66fc9c6d2cac69cf63a374f1',
        status: true,
        createdAt: '2025-01-09T03:28:41.293Z',
        updatedAt: '2025-01-09T03:28:41.293Z',
        files: [
          {
            _id: '677f4384a283ce568efc5737',
            originalName: 
              'Google Cloud Certified - Professional Cloud Developer.pdf',
            name: '69d491a7-e870-4133-8cd2-ad7153b211f6.pdf',
            path: 'uploads/677db103e9c6905425ea1bec/6724ccc736a2e8c68d2c27fa',
            mimetype: 'application/pdf',
            folder: '677f42693167af60387be217',
            availability: 'private',
            user: '66fc9c6d2cac69cf63a374f1',
            status: true,
            createdAt: '2025-01-09T03:33:24.106Z',
            updatedAt: '2025-01-09T03:33:24.106Z'
          }
        ]
      }
    ]
  }
    */
    try {
        const {data} = await getFilesApi(); 
        
        simple.value[0].children = data.privateFolders?.map(folder => {
            return {
                label: folder.name,
                icon: 'folder',
                children: folder.files.map(file => {
                    return {
                        label: file.originalName,
                        icon: 'description'
                    }
                })
            }
        });

        simple.value[1].children = data.publicFolders?.map(folder => {
            return {
                label: folder.name,
                icon: 'folder',
                children: folder.files.map(file => {
                    return {
                        label: file.originalName,
                        icon: 'description'
                    }
                })
            }
        });

    } catch (error) {
        console.log(error);
    }
}


</script>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>
