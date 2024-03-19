<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import axiosIns from '@/plugins/axios';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

onMounted(async () => {
  await fetchProducts()
})

interface State {
  products: any | null,
  isDialogDeleteVisible: boolean,
  deleteProduct: any
}

const state: State = reactive({
  products: null,
  isDialogDeleteVisible: false,
  deleteProduct: null
})

const page = ref({ title: 'Produto' });

const breadcrumbs = shallowRef([
  {
    title: 'Product',
    disabled: true,
    href: '#'
  }
]);
async function fetchProducts () {
  axiosIns
      .get(`${baseUrl}/product`)
      .then((res) => {
        const response = res.data
        state.products = response.data;
        
      })
      .catch((err) => {
        const response = err.response.data
        // if(response.message){
          // pushSnackbar({ type: 'error', message: response.message })
        // }
        // if(response.data) {
        //   response.data.map((erro: any) => {
        //     pushSnackbar({ type: 'error', message: erro.msg })
        //   })
        // }
      });
}

const headers = ref([
  {title: 'Nome', key: 'name'},
  {title: 'Valor', key: 'valor'},
  {title: 'Criado', key: 'createdAt'},
  {title: 'Ações', key: 'actions'},
])

function deleteItemConfirm(){
  state.isDialogDeleteVisible = false;
  if(state.deleteProduct){
    axiosIns
      .delete(`${baseUrl}/product/${state.deleteProduct._id}`)
      .then((res) => {
        const response = res.data
        fetchProducts();
      })
      .catch((err) => {
        const response = err.response.data
        // if(response.message){
          // pushSnackbar({ type: 'error', message: response.message })
        // }
        // if(response.data) {
        //   response.data.map((erro: any) => {
        //     pushSnackbar({ type: 'error', message: erro.msg })
        //   })
        // }
      });
  }
}

function closeDelete() {
  state.isDialogDeleteVisible = false;
}

function deleteItem(item: any) {
  state.isDialogDeleteVisible = true;
  state.deleteProduct = item;
}

</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Lista">
        <v-data-table
          :headers="headers"
          :items="state.products"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          v-if="state.products"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-dialog  :model-value="state.isDialogDeleteVisible"
        max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Tem certeza que deseja deletar este produto?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon
              class="me-2"
              size="small"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon> -->
            <v-icon
              size="small"
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>   
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
