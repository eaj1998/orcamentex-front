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

interface productOrder {
  _id: String
  title: String
  valor: Number
  code: String
  qtd: Number
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

const getProducts = (searchProduct: string) => {
  clearTimeout(typing)
  typing = setTimeout(() => { fetchProducts(searchProduct) }, 120)
}

const itemsProducts = ref<productOrder[]>([])

const fetchProducts = (searchProduct: string) => {
  if (searchProduct.length <= 1) return
  
  axiosIns.get(`${baseUrl}/product/order`,{ params: { g: searchProduct }}).then(res => {
    const response = res.data;
    if (response.status === 1) {
      itemsProducts.value = response.data
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

const productsTable = ref({
  headers:[ 
    {title: 'Codigo', key: 'code', sortable: false},
    {title: 'Nome', key: 'title', sortable: false},
    {title: 'Valor', key: 'valor', sortable: false},
    {title: 'Qtd', key: 'qtd', sortable: false},
    {title: 'Ações', key: 'actions', sortable: false},
  ]  
})

function clearSelection(item: any) {
  if(form.value.products.find(x => x._id === item.raw._id)) {
    pushSnackbar({ type: 'error', message: "Produto já adicionado! Utilize a tabela abaixo para editar a quantidade" })
    return
  }    

  form.value.searchProduct = ''
  itemsProducts.value = []
  form.value.products.push({_id:item.raw._id, code: item.raw.code ,title: item.raw.name, valor: item.raw.valor, qtd: 1})

}

function deleteItem(index: any) {
  form.value.products.splice(index, 1)
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
                  <v-autocomplete
                    v-model="form.searchProduct"
                    @update:search="getProducts"
                    label="Produto"
                    :items="itemsProducts"
                    item-title="name"
                    item-value="_id"
                    class="mt-4 mb-8"
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    clearable
                    :item-text="(item: any) => `${item.raw.code} ${item.raw.title}`"
                  >  
                    <template v-slot:item="{ item, props }">
                      <v-list-item
                          :="props"
                          @click="clearSelection(item)"                          
                      >                                        
                    </v-list-item>
                  </template>
                </v-autocomplete>
                  <v-data-table
                      :headers="productsTable.headers"
                      :items="form.products"
                      hide-default-footer 
                      disable-pagination
                      disable-sort
                      v-if="form.products"
                    >                    
                      <template 
                      v-slot:item.qtd="{ item }">
                        {{ item.qtd !== null ? item.qtd : 0 }}
                      </template>   
                      <template v-slot:item.actions="{ index, item }">     
                          <v-icon
                            size="small"
                            @click="deleteItem(index)"
                          >
                            mdi-delete
                          </v-icon>
                      </template>
                  </v-data-table>                  
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
