const CustomerRoutes = {
    path: '/customer',
    meta: {
      requiresAuth: true
    },
    redirect: '/customer',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
      {
        name: 'Customer Create',
        path: '/customer/create',
        component: () => import('@/views/customer/CustomerForm.vue')
      },
      {
        name: 'Customer List',
        path: '/customer/list',
        component: () => import('@/views/customer/Customer.vue')
      },
      {
        name: 'Customer Edit',
        path: '/customer/edit/:id',
        component: () => import('@/views/customer/CustomerForm.vue')
      }
    ]
  };
  
  export default CustomerRoutes;
  