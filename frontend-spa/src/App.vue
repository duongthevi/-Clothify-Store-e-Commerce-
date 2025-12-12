<script setup>
import AppHeader from '@/components/layouts/AppHeader.vue'
import AppFooter from '@/components/layouts/AppFooter.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <div class="flex-grow-1 mt-3">
      <router-view />
    </div>

    <AppFooter />
  </div>
</template>

<style>
.page {
  max-width: 400px;
  margin: auto;
}
</style>
