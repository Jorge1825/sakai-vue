<template>
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
                                <div v-for="child in node.children" :key="child.label" class="col-2 cursor-pointer">
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
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.
                        </p>
                    </q-tab-panel>
                </template>
            </q-tab-panels>
        </template>
    </q-splitter>
</template>

<script setup>
import { ref } from 'vue';

let splitterModel = ref(20);
let selected = ref('Food');

let simple = ref([
    {
        label: 'Relax Hotel',
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
        ]
    },
    {
        label: 'Relax Hotel',
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
        ]
    },
    {
        label: 'Relax Hotel',
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
        ]
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
</script>

<style scoped>
.my-card {
    cursor: pointer;
}
</style>
