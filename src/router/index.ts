import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import ProductRoutes from './ProductRoutes';
import CustomerRoutes from './CustomerRoutes';
import OrderRoutes from './OrderRoutes';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    AuthRoutes,
    ProductRoutes,
    CustomerRoutes,
    OrderRoutes
  ]
});

router.beforeEach(async (to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login'];
  const authRequired = !publicPages.includes(to.path);
  const accessToken = localStorage.getItem('accessToken');
  
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    
    if (authRequired && !accessToken) {
      return next('/auth/login');
    } else next();
  } else {
    next();
  }
});
