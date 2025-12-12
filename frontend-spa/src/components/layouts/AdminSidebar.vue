<script setup>
import { RouterLink } from 'vue-router'

const menuItems = [
  { name: 'user', label: 'Người dùng', path: '/admin/users', icon: 'bi bi-person' },
  { name: 'products', label: 'Sản phẩm', path: '/admin/products', icon: 'bi bi-box-seam' },
  { name: 'categories', label: 'Danh mục', path: '/admin/categories', icon: 'bi bi-tags' },
  { name: 'payments', label: 'Thanh toán', path: '/admin/payments', icon: 'bi bi-credit-card' },
]
</script>

<template>
  <div class="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style="width: 250px; height: 100vh;">
    <a href="/admin" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
      <span class="fs-4">Admin Panel</span>
    </a>
    <hr>
    <ul class="nav nav-pills flex-column mb-auto">
      <li v-for="item in menuItems" :key="item.name" class="nav-item">
        <RouterLink
          class="nav-link text-white"
          active-class="active"
          :to="item.path"
        >
          <i :class="item.icon" class="me-2"></i>{{ item.label }}
        </RouterLink>
      </li>
    </ul>
    <hr>
    <div class="text-center">
      <small>&copy; 2025 Admin</small>
    </div>
  </div>
</template>


<style scoped>
.nav-link.active {
  background-color: #0d6efd !important;
}
</style>
