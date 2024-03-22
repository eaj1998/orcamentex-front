<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import axiosIns from '@/plugins/axios';
import { router } from '@/router';

import { format, unformat } from 'v-money3';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { SnackbarItem } from '@/types/structure';
import { useRoute } from 'vue-router';

const route = useRoute()

const baseUrl = `${import.meta.env.VITE_API_URL}`;

onMounted(async () => {
  if(route.params.id){
    fetchOrder()
  }
})

interface customer {
  _id: string
  name:string
}

const items = ref<customer[]>([])

const fetchCustomers = (searchCustomer: string) => {
  if (searchCustomer.length <= 3) return
  
  axiosIns.get(`${baseUrl}/customer/getCustomers`,{ params: { name: searchCustomer }}).then(res => {
    const response = res.data;
    if (response.status === 1) {
      items.value = response.data
    }
  })
}

type NewType = NodeJS.Timeout;

let typing: NewType;

const getCustomer = (searchCustomer: string) => {
  clearTimeout(typing)
  typing = setTimeout(() => { fetchCustomers(searchCustomer) }, 120)
}

function fetchOrder() {
  axiosIns
      .get(`${baseUrl}/order/${route.params.id}`)
      .then((res) => {
        const response = res.data
        form.value.title = response.data.title
        form.value.customer = response.data.customer
        form.value.products = response.data.products
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

const snackbarList = ref([]);

const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}

const form = ref({
  title: '',
  customer: '',
  products: []
})

  
const page = ref({ title: 'Orçamento' });
const breadcrumbs = shallowRef([
  {
    title: 'Orçamento',
    disabled: true,
    href: '#'
  }
]);

function saveProduct() {
  if(route.params.id){
    axiosIns
      .put(`${baseUrl}/product/${route.params.id}`, form.value)
      .then((res) => {
        const response = res.data
        form.value.name = response.data.name
        form.value.valor = response.data.valor
        pushSnackbar({ type: 'success', message: 'Orçamento alterado com sucesso!' })
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
  } else {
    axiosIns
      .post(`${baseUrl}/order`, form.value)
      .then((res) => {
        const response = res.data
        form.value.title = ''
        form.value.customer = ''
        form.value.products = []

        pushSnackbar({ type: 'success', message: 'Produto adicionado com sucesso!' })
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
}
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard :title="route.params.id ? 'Editar': 'Cadastrar'">
        <v-row>
            <v-col cols="12" md="12">
                <v-form class="mt-7 loginForm">
                    <v-text-field
                    v-model="form.title"
                    label="Titulo"
                    class="mt-4 mb-8"
                    required
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    ></v-text-field>
                    <v-autocomplete
                    v-model="form.customer"
                    @update:search="getCustomer"
                    label="Cliente"
                    :items="items"
                    item-title="name"
                    item-value="_id"
                    class="mt-4 mb-8"
                    required
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                  ></v-autocomplete>
                    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="saveProduct">
                    Gerar Orçamento</v-btn
                    >
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
                    <!-- <div v-if="errors.apiError" class="mt-2">
                    <v-alert color="error">{{ errors.apiError }}</v-alert>
                    </div> -->
                </v-form>
            </v-col>
    </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
