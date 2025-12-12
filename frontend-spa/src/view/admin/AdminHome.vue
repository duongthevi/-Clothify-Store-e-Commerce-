<template>
  <div class="container mt-5 text-center">
    <div class="bg-light p-4 rounded shadow">
      <h2>Chào mừng Admin!</h2>
      <p class="lead">Quản lý cửa hàng <strong>TrendFit</strong> tại đây.</p>

    <img
      :src="logo"
      alt="TrendFit Logo"
      class="mt-4"
      style="max-height: 400px; object-fit: contain"
    />
  </div>
  </div>
</template>

<script setup>
import logo from '@/assets/images/logo.png'
</script>
