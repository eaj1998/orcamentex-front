<script setup lang="ts">
import { ref, shallowRef } from 'vue';

import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';

const page = ref({ title: 'Sample Page' });

</script>

<template>
  <v-row>
    <v-col cols="12" md="12">
      <UiParentCard title="Tubo Oeste">
        <div class="pb-5">
          <h1>Seja bem vindo!</h1>        
        </div>
        <div class="container text-center">
          <img src="@/assets/images/logos/Logo.png" alt="grid" cover />
        </div>
      </UiParentCard>
    </v-col>
  </v-row>
</template>

<style>
.container img {
    max-width:800px;
    max-height:1000px;
    width: auto;
    height: auto;
    align-self: center;
}
</style>