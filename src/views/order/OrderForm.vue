<script setup lang="ts">
import { onMounted, ref, shallowRef, type Ref } from 'vue';
import axiosIns from '@/plugins/axios';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import type { SnackbarItem, customer, productOrder } from '@/types/structure';
import { useRoute } from 'vue-router';
import { router } from '@/router';

import { Utils } from "@/utils/Util";

const route = useRoute()

const baseUrl = `${import.meta.env.VITE_API_URL}`;

onMounted(async () => {
  if (route.params.id) {
    fetchOrder()
  }
})

const items = ref<customer[]>([])

const fetchCustomers = (searchCustomer: string) => {
  if (searchCustomer.length <= 3) return

  axiosIns.get(`${baseUrl}/customer/getCustomers`, { params: { g: searchCustomer } }).then(res => {
    const response = res.data;
    if (response.status === 1) {
      items.value = response.data
    }
  })
}

const itemsProducts = ref<productOrder[]>([])

async function fetchProducts(searchProduct: string) {
  await axiosIns.get(`${baseUrl}/product/code`, { params: { g: searchProduct } }).then(res => {
    const response = res.data;
    if (response.data) {
      const prod = response.data[0]

      if (form.value.products.find(x => x.product._id === prod._id)) {
        pushSnackbar({ isVisible: true, type: 'error', message: "Produto já adicionado! Utilize a tabela abaixo para editar a quantidade" })
        return
      }
      form.value.products.push({ product: prod, price: prod.price, quantity: 1 })
      form.value.searchProduct = ''
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
      if (response.message && !response.data) {
        pushSnackbar({ isVisible: true, type: 'error', message: response.message })
        return
      }
      if (response.data) {
        response.data.map((erro: any) => {
          pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
        })
      }
    });
}

const snackbarList: Ref<SnackbarItem[]> = ref([]);

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
  products: ref<productOrder[]>([]),
  searchProduct: ''
})


const page = ref({ title: 'Orçamento' });
const breadcrumbs = shallowRef([
  {
    title: 'Orçamento',
    disabled: true,
    href: '#'
  }
]);

async function saveOrder() {
  if (route.params.id) {
    await axiosIns
      .put(`${baseUrl}/order/${route.params.id}`, form.value)
      .then((res) => {
        pushSnackbar({ isVisible: true, type: 'success', message: 'Orçamento alterado com sucesso!' })
      })
      .catch((err) => {
        const response = err.response.data

        if (response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
          })
        }
      });
  } else {
    await axiosIns
      .post(`${baseUrl}/order`, form.value)
      .then((res) => {
        const response = res.data
        router.push({ path: `/order/view/${response.data._id}` });

        pushSnackbar({ isVisible: true, type: 'success', message: 'Orçamento gerado com sucesso!' })
      })
      .catch((err) => {
        const response = err.response.data
        if (response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: erro.msg })
          })
        }
      });
  }
}

const productsTable = ref({
  headers: [
    { title: 'Codigo', key: 'product.code', sortable: false },
    { title: 'Nome', key: 'product.name', sortable: false },
    { title: 'Valor', key: 'price', sortable: false },
    { title: 'Qtd', key: 'quantity', sortable: false },
    { title: 'Ações', key: 'actions', sortable: false },
  ]
})

function deleteItem(index: any) {
  form.value.products.splice(index, 1)
}

const handleSearchProduct = () => {
  const searchProduct = form.value.searchProduct;
  if (searchProduct.length >= 1) {
    fetchProducts(searchProduct);
  }
};
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard :title="route.params.id ? 'Editar' : 'Gerar'">
        <v-row>
          <v-col cols="12" md="12">
            <v-form class="mt-7 loginForm">
              <v-autocomplete v-model="form.customer" @update:search="getCustomer" label="Cliente" :items="items"
                item-title="name" item-value="_id" class="mt-4 mb-8" required density="comfortable" hide-details="auto"
                variant="outlined" color="primary"></v-autocomplete>
              <v-row>
                <v-col cols="10">
                  <v-text-field v-model="form.searchProduct" label="Produto" class="mt-4 mb-8" density="comfortable"
                    hide-details="auto" variant="outlined" color="primary"></v-text-field>
                </v-col>
                <v-col cols="2" class="d-flex align-center">
                  <v-btn color="primary" class="mt-4 mb-8" @click="handleSearchProduct">
                    Buscar
                  </v-btn>
                </v-col>
              </v-row>
              <v-data-table :headers="productsTable.headers" :items="form.products" hide-default-footer
                disable-pagination disable-sort v-if="form.products">
                <template v-slot:item.price="{ index, item }">
                  {{ Utils.formatMoney(item.price) }}
                </template>
                <template v-slot:item.quantity="{ index, item }">
                  <v-text-field v-model="form.products[index].quantity" density="compact" single-line color="primary"
                    variant="plain" type="number"></v-text-field>
                </template>
                <template v-slot:item.actions="{ index, item }">
                  <v-icon size="small" @click="deleteItem(index)">
                    mdi-delete
                  </v-icon>
                </template>
              </v-data-table>
              <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="saveOrder">
                Gerar Orçamento</v-btn>
              <VSnackbar v-for="(item, index) in snackbarList" :key="`snack-${index}`" v-model="item.isVisible"
                location="bottom center" :color="item.type" close-on-content-click
                :class="(index < (snackbarList.length - 1)) ? 'secondary-snackbar' : ''">
                {{ item.message }}
              </VSnackbar>
            </v-form>
          </v-col>
        </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
