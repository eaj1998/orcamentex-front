import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import download from 'downloadjs';
import { ref, type Ref } from 'vue';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const snackbarList: Ref<SnackbarItem[]> = ref([]);


const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}

const ProductRoutes = {
    path: '/product',
    meta: {
      requiresAuth: true
    },
    redirect: '/product',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
      {
        name: 'Product Create',
        path: '/product/create',
        component: () => import('@/views/product/ProductForm.vue')
      },
      {
        name: 'Product List',
        path: '/product/list',
        component: () => import('@/views/product/Product.vue')
      },
      {
        name: 'Product Edit',
        path: '/product/edit/:id',
        component: () => import('@/views/product/ProductForm.vue')
      },
      {
        name: 'Download Tabela de Preco',
        path: '/product/downloadTabela/:downloadTabela',
        component: async () => {
          await axiosIns
      .get(
        `${baseUrl}/product/downloadTabela`, 
        {
      responseType: "blob",
    })
      .then((res) => {
        const content = res.headers['content-type']
        
        download(res.data, `Tabela De Precos.pdf`,content)
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
      }      
    ]
  };
  
  export default ProductRoutes;
  