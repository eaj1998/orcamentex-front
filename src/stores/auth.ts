import { defineStore } from 'pinia';
import { router } from '@/router';
import axiosIns from '@/plugins/axios';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    accessToken: localStorage.getItem('accessToken'),
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      axiosIns
      .post(`${baseUrl}/auth/login`, {email: username, password: password})
      .then((res) => {
        const response = res.data
        this.accessToken = response.data.token;
        localStorage.setItem('accessToken', response.data.token);
        router.push({path: 'home'});

      })
      .catch((error) => {
        console.log(error.response.data);
        
      });
    },
    logout() {
      localStorage.removeItem('accessToken');
      router.push({path: '/auth/login'});
    }
  }
});
