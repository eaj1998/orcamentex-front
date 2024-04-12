<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef, type Ref } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import { router } from '@/router';
import download from 'downloadjs'

import { Utils } from "@/utils/Util";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const snackbarList: Ref<SnackbarItem[]> = ref([]);

const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}


onMounted(async () => {
  await fetchOrders()
})

interface State {
  orders: any | null,
  isDialogDeleteVisible: boolean,
  deleteProduct: any,
  search: any
}

const state: State = reactive({
  orders: null,
  isDialogDeleteVisible: false,
  deleteProduct: null,
  search: ''
})

const page = ref({ title: 'Orçamento' });

const breadcrumbs = shallowRef([
  {
    title: 'Orcamento',
    disabled: true,
    href: '#'
  }
]);
async function fetchOrders () {
  axiosIns
      .get(`${baseUrl}/order`)
      .then((res) => {
        const response = res.data
        state.orders = response.data;
        
      })
      .catch((err) => {
        const response = err.response.data
        if(response.message){
          pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
          })
        }
      });
}

const headers = ref([
  {title: 'Titulo', key: 'title'},
  {title: 'Cliente', key: 'customer.name'},
  {title: 'Criado', key: 'createdAt'},
  {title: 'Ações', key: 'actions'},
])

function deleteItemConfirm(){
  state.isDialogDeleteVisible = false;
  if(state.deleteProduct){
    axiosIns
      .delete(`${baseUrl}/order/${state.deleteProduct._id}`)
      .then((res) => {
        const response = res.data
        fetchOrders();
        pushSnackbar({ isVisible:true, type: 'success', message: 'Orçamento deletado com sucesso!' })

      })
      .catch((err) => {
        const response = err.response.data
        if(response.message){
          pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
          })
        }
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
  router.push({path: `/order/edit/${item._id}`});
}

async function downloadPdf (item: any) {
 await axiosIns
      .post(
        `${baseUrl}/order/download`, 
        {id: item._id},{
      responseType: "blob",
    })
      .then((res) => {
        const content = res.headers['content-type']
        
        download(res.data, `${item.customer.name}-orcamento${Date.now()}.pdf`,content)
        pushSnackbar({ isVisible:true, type: 'success', message: 'Download realizado com sucesso!' })

      })
      .catch((err) => {
        
        const response = err.response.data
        if(response.message){
          pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
          })
        }
      });
}

function viewItem(item: any) {
  router.push({path: `/order/view/${item._id}`});
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
          :items="state.orders"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          v-if="state.orders"
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
                  <v-card-title class="text-h5">Tem certeza que deseja deletar este orçamento?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
          </template>
          <template v-slot:item.createdAt="{item}: {item: any}">
            {{ Utils.formatDateFromString(item.createdAt) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              class="me-2"
              size="small"
              @click="viewItem(item)"
            >
              mdi-eye
            </v-icon>
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
            <v-icon
              size="small"
              @click="downloadPdf(item)"
            >
              mdi-file-pdf-box
            </v-icon>
          </template>   
        </v-data-table>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
