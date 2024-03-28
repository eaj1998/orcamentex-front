<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import { router } from '@/router';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const snackbarList = ref([]);

const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}


onMounted(async () => {
  await fetchProducts()
})

interface State {
  products: any | null,
  isDialogDeleteVisible: boolean,
  deleteProduct: any,
  search: any
}

const state: State = reactive({
  products: null,
  isDialogDeleteVisible: false,
  deleteProduct: null,
  search: ''
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
        if(response.message){
          pushSnackbar({ type: 'error', message: response.message })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ type: 'error', message: erro.msg })
          })
        }
      });
}

const headers = ref([
  {title: 'Codigo', key: 'code'},
  {title: 'Nome', key: 'name'},
  {title: 'Valor', key: 'price'},
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
        pushSnackbar({ type: 'success', message: 'Produto deletado com sucesso!' })

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

function editItem (item: any) {
  router.push({path: `/product/edit/${item._id}`});
}

</script>

<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <VSnackbar
        v-for="(item, index) in snackbarList"
        :key="`snack-${index}`"

        v-model="item.isVisible"
        location="bottom center"
        :color="item.type"

        close-on-content-click

        :class="(index < (snackbarList.length - 1)) ? 'secondary-snackbar' : ''"
    >
        {{ item.message }}
    </VSnackbar>
    <v-col cols="12" md="12">
      <UiParentCard title="Lista">
        <v-data-table
          :headers="headers"
          :items="state.products"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          v-if="state.products"
          :search="state.search"
        >
          <template v-slot:top>
           
              <v-text-field
              v-model="state.search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
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
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
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
