<script setup lang="ts">
import { onMounted, ref, shallowRef, type Ref } from 'vue';
import axiosIns from '@/plugins/axios';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { type customer, type SnackbarItem, type productOrder } from '@/types/structure';
import { useRoute } from 'vue-router';
import { reactive } from 'vue';
import download from 'downloadjs';

import { Utils } from "@/utils/Util";

const route = useRoute()

const baseUrl = `${import.meta.env.VITE_API_URL}`;

interface State {
  total: any | 0,
}

const state: State = reactive({
    total: null,
})
onMounted(async () => {
  if(route.params.id){
    await fetchOrder()
    state.total = await cartTotalAmount()
  }
})

async function fetchOrder() {
 await axiosIns
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
          pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ isVisible: true, type: 'error', message: err.msg })
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
  customer: ref<customer>,
  products: ref<productOrder[]>([]),
})

  
const page = ref({ title: 'Orçamento Visualização' });
const breadcrumbs = shallowRef([
  {
    title: 'Orçamento',
    disabled: true,
    href: '#'
  }
]);


const productsTable = ref({
  headers:[ 
    {title: 'Codigo', key: 'product.code', sortable: false},
    {title: 'Nome', key: 'product.name', sortable: false},
    {title: 'Valor', key: 'price', sortable: false},
    {title: 'Qtd', key: 'quantity', sortable: false},
    {title: 'Total', key: 'total', sortable: false},
  ]  
})


async function cartTotalAmount() {
    let total = 0;
    console.log(form.value.products);
    
    total = form.value.products.reduce( (acc, item: any) => {
        return acc + (  item.price * item.quantity)
    }, 0)

    return total;
}
const showFooter = ref(false)

async function downloadPdf () {
 await axiosIns
      .post(
        `${baseUrl}/order/download`, 
        {id: route.params.id},{
      responseType: "blob",
    })
      .then((res) => {
        const content = res.headers['content-type']
        
        download(res.data, `${form.value.customer.name}-orcamento${Date.now()}.pdf`,content)
        pushSnackbar({ isVisible: true, type: 'success', message: 'Download realizado com sucesso!' })

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

async function sendEmail () {
 await axiosIns
      .post(
        `${baseUrl}/order/send`, 
        {id: route.params.id})
      .then((res) => {
        
        pushSnackbar({ isVisible: true, type: 'success', message: 'Em-mail enviado com sucesso!' })

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
      <UiParentCard>
        <v-row>
            <v-col cols="12" md="12">
                <v-form class="mt-7 loginForm">
                    <v-text-field
                    v-model="form.title"
                    label="Titulo"
                    class="mb-8"
                    required
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    :readonly="true"
                    ></v-text-field>
                    <v-autocomplete
                    v-model="form.customer"
                    label="Cliente"
                    item-title="name"
                    item-value="_id"
                    class="mt-4 mb-8"
                    required
                    density="comfortable"
                    hide-details="auto"
                    variant="outlined"
                    color="primary"
                    :readonly="true"
                  ></v-autocomplete>                 
                  <v-data-table
                      :headers="productsTable.headers"
                      :items="form.products"
                      disable-sort
                      v-if="form.products"
                    >                    
                      <template 
                      v-slot:item.quantity="{ index, item }"
                      >            
                      <v-text-field
                          v-model="form.products[index].quantity"
                          density="comfortable"
                          single-line
                          color="primary"
                          variant="plain"
                          type="number"
                          :readonly="true"
                      ></v-text-field>                      
                      </template>     
                      <template v-slot:item.price="{ index, item }">     
                          {{  Utils.formatMoney(item.price) }}
                      </template>                    
                      <template v-slot:item.total="{item}: {item: any}" >     
                          {{  Utils.formatMoney(item.quantity * item.price) }}
                      </template>
                    <template #bottom v-if="!showFooter"></template>
                  </v-data-table>    
                  <v-row>
                    <v-col cols="6" md="6" class="download-order">
                      <v-btn color="primary" @click="downloadPdf">Baixar Orçamento</v-btn>
                      <v-btn class="mail-order" color="primary" @click="sendEmail">Enviar por E-mail</v-btn>
                    </v-col>
                    <v-col cols="6" md="6" class="invoice-total">Total: {{ Utils.formatMoney(state.total) }}  </v-col>
                  </v-row>                                           
                </v-form>
            </v-col>
    </v-row>
      </UiParentCard>
    </v-col>
  </v-row>
</template>
<style>
    .invoice-total {
        margin-top: 20px;
        text-align: right;
        font-size: 20px;
        font-weight: bold;
    }
    .download-order {
        margin-top: 20px
    }
    .mail-order {
      margin-left: 10px;
      text-align: left;
    }
</style>