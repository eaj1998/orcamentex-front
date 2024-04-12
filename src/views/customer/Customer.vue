<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef, type Ref } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import { router } from '@/router';
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
  await fetchCustomers()
})

interface State {
  customers: any | null,
  isDialogDeleteVisible: boolean,
  deleteProduct: any,
  search: any
}

const state: State = reactive({
  customers: null,
  isDialogDeleteVisible: false,
  deleteProduct: null,
  search: ''
})

const page = ref({ title: 'Cliente' });

const breadcrumbs = shallowRef([
  {
    title: 'Cliente',
    disabled: true,
    href: '#'
  },
  {
    title: 'Lista',
    disabled: true,
    href: '#'
  }
]);
async function fetchCustomers () {
  axiosIns
      .get(`${baseUrl}/customer`)
      .then((res) => {
        const response = res.data
        state.customers = response.data;
        
      })
      .catch((err) => {
        const response = err.response.data
        if(response.message){
          pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({isVisible: true, type: 'error', message: erro.msg })
          })
        }
      });
}

const headers = ref([
  {title: 'Nome', key: 'name'},
  {title: 'Telefone', key: 'phone'},
  {title: 'Criado', key: 'createdAt'},
  {title: 'Ações', key: 'actions'},
])

function deleteItemConfirm(){
  state.isDialogDeleteVisible = false;
  if(state.deleteProduct){
    axiosIns
      .delete(`${baseUrl}/customer/${state.deleteProduct._id}`)
      .then((res) => {
        const response = res.data
        fetchCustomers();
        pushSnackbar({ isVisible:true,type: 'success', message: 'Cliente deletado com sucesso!' })

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
  router.push({path: `/customer/edit/${item._id}`});
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
          :items="state.customers"
          :sort-by="[{ key: 'createdAt', order: 'desc' }]"
          v-if="state.customers"
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
                  <v-card-title class="text-h5">Tem certeza que deseja deletar este cliente?</v-card-title>
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
