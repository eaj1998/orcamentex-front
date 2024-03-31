<script setup lang="ts">
const props = defineProps({
  title: String,
  isDividerActive: Boolean
});
</script>

// ===============================|| Ui Parent Card||=============================== //
<template>
  <v-card variant="flat">
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
