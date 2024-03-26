const OrderRoutes = {
    path: '/order',
    meta: {
      requiresAuth: true
    },
    redirect: '/order',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
      {
        name: 'order Create',
        path: '/order/create',
        component: () => import('@/views/order/OrderForm.vue')
      },
      {
        name: 'order List',
        path: '/order/list',
        component: () => import('@/views/order/OrderList.vue')
      },
      {
        name: 'order Edit',
        path: '/order/edit/:id',
        component: () => import('@/views/order/OrderForm.vue')
      }
    ]
  };
  
  export default OrderRoutes;
  