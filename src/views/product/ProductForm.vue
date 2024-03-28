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

const config = {
    debug: false,
    masked: false,
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: '.',
    precision: 2,
    disableNegative: false,
    disabled: false,
    min: null,
    max: null,
    allowBlank: false,
    minimumNumberOfCharacters: 0,
    modelModifiers: {
        number: false,
    },
    shouldRound: true,
    focusOnRight: false,
}

onMounted(async () => {
  if(route.params.id){
    fetchProduct()
  }
})

function fetchProduct() {
  axiosIns
      .get(`${baseUrl}/product/${route.params.id}`)
      .then((res) => {
        const response = res.data
        form.value.name = response.data.name
        form.value.price = response.data.price
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
  name: '',
  price: '',
})


function maskValor () {
  
  form.value.price = format(form.value.price, config);
  
  }

  
const page = ref({ title: 'Produto' });
const breadcrumbs = shallowRef([
  {
    title: 'Produto',
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
        form.value.price = response.data.price
        pushSnackbar({ type: 'success', message: 'Produto alterado com sucesso!' })
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
      .post(`${baseUrl}/product`, form.value)
      .then((res) => {
        const response = res.data
        form.value.name = ''
        form.value.price = ''
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
                    v-model="form.name"
                    label="Nome"
                    class="mt-4 mb-8"
                    required
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    ></v-text-field>
                    <v-text-field
                    v-model="form.price"
                    label="Valor"
                    class="mt-4 mb-8"
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    @change="maskValor"
                    ></v-text-field>
                    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="saveProduct">
                    Salvar</v-btn
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
