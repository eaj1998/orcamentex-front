<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import axiosIns from '@/plugins/axios';
import { router } from '@/router';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { SnackbarItem } from '@/types/structure';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

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
  valor: 0,
})

const page = ref({ title: 'Produto' });
const breadcrumbs = shallowRef([
  {
    title: 'Produto',
    disabled: true,
    href: '#'
  }
]);

function saveProduct() {
    axiosIns
      .post(`${baseUrl}/product`, form.value)
      .then((res) => {
        const response = res.data
        console.log(response);
        return;
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
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Criar">
        <v-row>
            <v-col cols="12" md="12">
                <Form @submit="saveProduct" class="mt-7 loginForm">
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
                    v-model="form.valor"
                    label="Valor"
                    class="mt-4 mb-8"
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    ></v-text-field>
                    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" type="submit">
                    Salvar</v-btn
                    >
                    <!-- <VSnackbar
                    v-for="(item, index) in snackbarList"
                    :key="`snack-${index}`"

                    v-model="item.isVisible"
                    location="bottom center"
                    :color="item.type"

                    close-on-content-click

                    :class="(index < (snackbarList.length - 1)) ? 'secondary-snackbar' : ''"
                >
                    {{ item.message }}
                </VSnackbar> -->
                    <!-- <div v-if="errors.apiError" class="mt-2">
                    <v-alert color="error">{{ errors.apiError }}</v-alert>
                    </div> -->
                </Form>
            </v-col>
    </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
