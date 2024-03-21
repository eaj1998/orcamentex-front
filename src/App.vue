<template>
  <RouterView :key="$route.fullPath"></RouterView>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>
