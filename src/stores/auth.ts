import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import axiosIns from '@/plugins/axios';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      // const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

      axiosIns
      .post(`${baseUrl}/auth/login`, {email: 'edipo1998@gmail.com', password: 'Test@123'})
      .then((res) => {
           console.log(res)
      })
      .catch((error) => {
           console.log(error);
      });
      // update pinia state
      // this.user = user;
      // // store user details and jwt in local storage to keep user logged in between page refreshes
      // localStorage.setItem('user', JSON.stringify(user));
      // // redirect to previous url or default to home page
      // router.push(this.returnUrl || '/dashboard/default');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  }
});
