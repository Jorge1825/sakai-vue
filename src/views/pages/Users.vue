<script setup>
import { getUsers } from '@/api/users';
import { ProductService } from '@/service/ProductService';
import { onBeforeMount, onMounted, ref } from 'vue';


const products = ref(null);
const productDialog = ref(false);
const product = ref({});

onBeforeMount(async () => {
    try {
        const {data} = await getUsers();
        console.log(data);
        products.value = data;
    } catch (error) {
        console.error(error);
    }

});

onMounted(() => {
    // ProductService.getProductsSmall().then((data) => (products.value = data));


    // console.log(products.value);

});


const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

function openDialog() {
    product.value = {};
    productDialog.value = true;
}


</script>


<template >
    <div class="" >

        <div class="col-span-12">
            <div class="card full-height" style="min-height: 82vh;">
                <div class="q-my-md row">
                    <div class="col-6 font-semibold text-xl ">Usuarios</div>
                    <div class="col-6 justify-end flex">
                        <Button label="Agregar" icon="pi pi-plus" severity="primary" class="mr-2" @click="openDialog"  />
                    </div>
                </div>

                <DataTable :value="products" :rows="10" :paginator="true" responsiveLayout="scroll" class="full-height">
                    <Column style="width: 15%" header="Name" field="username">
                    </Column>
                    <Column field="email" header="Email" :sortable="true" style="width: 35%"></Column>
                    <Column field="phone" header="Phone" :sortable="true" style="width: 15%"></Column>
                    <Column field="role" header="Role" :sortable="true" style="width: 15%"></Column>
                    <Column style="width: 15%" header="Status">
                        <template #body>
                            <Button icon="pi pi-search" type="button" class="p-button-text"></Button>
                        </template>
                    </Column>
                </DataTable>
            </div>
     
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block m-auto pb-4" />
                <div>
                    <label for="name" class="block font-bold mb-3">Name</label>
                    <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" fluid />
                    <small v-if="submitted && !product.name" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="description" class="block font-bold mb-3">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <div>
                    <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                    <Select id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div>

                <div>
                    <span class="block font-bold mb-4">Category</span>
                    <div class="grid grid-cols-12 gap-4">
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category1" v-model="product.category" name="category" value="Accessories" />
                            <label for="category1">Accessories</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category2" v-model="product.category" name="category" value="Clothing" />
                            <label for="category2">Clothing</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category3" v-model="product.category" name="category" value="Electronics" />
                            <label for="category3">Electronics</label>
                        </div>
                        <div class="flex items-center gap-2 col-span-6">
                            <RadioButton id="category4" v-model="product.category" name="category" value="Fitness" />
                            <label for="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-4">
                    <div class="col-span-6">
                        <label for="price" class="block font-bold mb-3">Price</label>
                        <InputNumber id="price" v-model="product.price" mode="currency" currency="USD" locale="en-US" fluid />
                    </div>
                    <div class="col-span-6">
                        <label for="quantity" class="block font-bold mb-3">Quantity</label>
                        <InputNumber id="quantity" v-model="product.quantity" integeronly fluid />
                    </div>
                </div>
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button label="Save" icon="pi pi-check" @click="saveProduct" />
            </template>
        </Dialog>

    </div>
</template>
