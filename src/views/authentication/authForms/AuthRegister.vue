<script setup lang="ts">
import { ref, type Ref } from 'vue';
import axiosIns from '@/plugins/axios';
import type { SnackbarItem } from '@/types/structure';
import { router } from '@/router';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

const show1 = ref(false);
const Regform = ref();
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})
const passwordRules = ref([
  (v: string) => !!v || 'Password is required',
  (v: string) => (v && v.length <= 10) || 'Password must be less than 10 characters'
]);
const emailRules = ref([(v: string) => !!v || 'E-mail is required', (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid']);


const snackbarList: Ref<SnackbarItem[]> = ref([]);

const pushSnackbar = (item: SnackbarItem) => {
  snackbarList.value.push({
    isVisible: true,
    type: item.type,
    message: item.message,
  })
}

function create() {
  axiosIns
      .post(`${baseUrl}/auth/register`, form.value)
      .then((res) => {
        const response = res.data
        if(response.status == 1){ 
          router.push({path: '/auth/confirm-otp'});
        }
      })
      .catch((err) => {
        const response = err.response.data
        if(response.message){
          pushSnackbar({ isVisible: true, type: 'error', message: response.message })
        }
        if(response.data) {
          response.data.map((erro: any) => {
            pushSnackbar({isVisible: true,  type: 'error', message: err.msg })
          })
        }
      });
}
</script>

<template>
  <h5 class="text-h5 text-center my-4 mb-8">Entre com seu Email</h5>
  <v-form ref="Regform" lazy-validation action="/dashboards/analytical" class="mt-7 loginForm">
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="form.firstName"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          label="Firstname"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="form.lastName"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          color="primary"
          label="Lastname"
        ></v-text-field>
      </v-col>
    </v-row>
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
      v-model="form.password"
      :rules="passwordRules"
      label="Password"
      required
      density="comfortable"
      variant="outlined"
      color="primary"
      hide-details="auto"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      @click:append="show1 = !show1"
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
