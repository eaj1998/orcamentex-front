<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import axiosIns from '@/plugins/axios';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { SnackbarItem } from '@/types/structure';
import { useRoute } from 'vue-router';

const route = useRoute()

const baseUrl = `${import.meta.env.VITE_API_URL}`;

onMounted(async () => {
  if(route.params.id){
    fetchProduct()
  }
})

function fetchProduct() {
  axiosIns
      .get(`${baseUrl}/customer/${route.params.id}`)
      .then((res) => {
        const response = res.data
        form.value.name = response.data.name
        form.value.phone = response.data.phone
        form.value.email = response.data.email
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
  phone: '',
  email: ''
})

  
const page = ref({ title: 'Cliente' });
const breadcrumbs = shallowRef([
  {
    title: 'Cliente',
    disabled: true,
    href: '#'
  }
]);

function saveProduct() {
  if(route.params.id){
    axiosIns
      .put(`${baseUrl}/customer/${route.params.id}`, form.value)
      .then((res) => {
        const response = res.data

        form.value.name = response.data.name
        form.value.phone = response.data.phone
        form.value.email = response.data.email

        pushSnackbar({ type: 'success', message: 'Cliente alterado com sucesso!' })
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
      .post(`${baseUrl}/customer`, form.value)
      .then((res) => {

        form.value.name = ''
        form.value.phone = ''
        form.value.email = ''
        if(res.data.status === 1)
          pushSnackbar({ type: 'success', message: 'Cliente adicionado com sucesso!' })
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
                    v-model="form.phone"
                    label="Telefone"
                    class="mt-4 mb-8"
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    ></v-text-field>
                    <v-text-field
                    v-model="form.email"
                    label="E-mail"
                    class="mt-4 mb-8"
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
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
