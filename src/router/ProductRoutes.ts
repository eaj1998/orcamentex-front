const ProductRoutes = {
    path: '/product',
    meta: {
      requiresAuth: true
    },
    redirect: '/product',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
      {
        name: 'Create',
        path: '/product/create',
        component: () => import('@/views/product/ProductForm.vue')
      },
      {
        name: 'Default',
        path: '/product/list',
        component: () => import('@/views/product/Product.vue')
      },
      {
        name: 'Starter',
        path: '/starter',
        component: () => import('@/views/StarterPage.vue')
      },
      {
        name: 'Tabler Icons',
        path: '/icons/tabler',
        component: () => import('@/views/utilities/icons/TablerIcons.vue')
      },
      {
        name: 'Material Icons',
        path: '/icons/material',
        component: () => import('@/views/utilities/icons/MaterialIcons.vue')
      },
      {
        name: 'Typography',
        path: '/utils/typography',
        component: () => import('@/views/utilities/typography/TypographyPage.vue')
      },
      {
        name: 'Shadows',
        path: '/utils/shadows',
        component: () => import('@/views/utilities/shadows/ShadowPage.vue')
      },
      {
        name: 'Colors',
        path: '/utils/colors',
        component: () => import('@/views/utilities/colors/ColorPage.vue')
      }
    ]
  };
  
  export default ProductRoutes;
  