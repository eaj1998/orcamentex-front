import { createRouter, createWebHistory } from 'vue-router';
import MainRoutes from './MainRoutes';
import AuthRoutes from './AuthRoutes';
import ProductRoutes from './ProductRoutes';
import CustomerRoutes from './CustomerRoutes';
import OrderRoutes from './OrderRoutes';
import { jwtDecode } from 'jwt-decode'

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
  
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    return next();
  }

  if (authRequired && typeof accessToken !=  "string") {
    return next('/auth/login');
  }

  const decodedPayload = jwtDecode(accessToken ?? "")
  const expirationTokenTime = decodedPayload.exp || 0
  
  if(Date.now()/1000 > expirationTokenTime){
    return next('/auth/login');  
  }

  return next();
  
});
