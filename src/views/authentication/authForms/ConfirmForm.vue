<script setup lang="ts">
import { ref } from 'vue';
import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import { router } from '@/router';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const Regform = ref();
const form = ref({
  email: '',
  otp: '',
})
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);

const snackbarList = ref([]);

const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}

function create() {
  axiosIns
      .post(`${baseUrl}/auth/verify-otp`, form.value)
      .then((res) => {
        const response = res.data
        if(response.status == 1){ 
          router.push({path:'/home'});
        }
      })
      .catch((err) => {
        const response = err.response.data
        if(response.message){
          pushSnackbar({ type: 'error', message: response.message })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({ type: 'error', message: erro.msg })
          })
        }
      });
}
</script>

<template>
  <v-form ref="Regform" lazy-validation  class="mt-7 loginForm">
    <v-text-field
      v-model="form.email"
      :rules="emailRules"
      label="Email Address / Username"
      class="mt-4 mb-4"
      required
      density="comfortable"
      hide-details="auto"
      variant="outlined"
      color="primary"
    ></v-text-field>
    <v-text-field
      v-model="form.otp"
      label="OTP"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      class="pwdInput"
    ></v-text-field>
    <v-btn color="secondary" block class="mt-2" variant="flat" size="large" @click="create()">Sign Up</v-btn>
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
  </v-form>
</template>
<style lang="scss">
.custom-devider {
  border-color: rgba(0, 0, 0, 0.08) !important;
}
.googleBtn {
  border-color: rgba(0, 0, 0, 0.08);
  margin: 30px 0 20px 0;
}
.outlinedInput .v-field {
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: none;
}
.orbtn {
  padding: 2px 40px;
  border-color: rgba(0, 0, 0, 0.08);
  margin: 20px 15px;
}
.pwdInput {
  position: relative;
  .v-input__append {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
