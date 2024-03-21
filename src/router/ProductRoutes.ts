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
      }
    ]
  };
  
  export default ProductRoutes;
  