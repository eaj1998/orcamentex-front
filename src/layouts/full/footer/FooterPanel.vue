<script setup lang="ts">
</script>
<template>
  <v-footer class="px-0 footer mt-2">
    <v-row justify="center" align="center" no-gutters>
        <p class="text-body-1 mb-0 text-sm-left text-center">
          EAJ@2024
        </p>
      <!-- <v-col class="text-sm-right text-center" cols="12" sm="6">
        <a
          v-for="(item, i) in footerLink"
          :key="i"
          class="mx-2 text-body-1 text-darkText text-decoration-none"
          target="_blank"
          :href="item.url"
        >
          {{ item.title }}
        </a>
      </v-col> -->
    </v-row>
  </v-footer>
</template>

<style lang="scss">
.v-footer {
  position: unset;
}
footer {
  a {
    &:hover {
      color: rgb(var(--v-theme-primary)) !important;
    }
  }
}
</style>
