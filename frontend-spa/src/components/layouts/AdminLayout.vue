<template>
  <div class="d-flex min-vh-100 m-0 p-0">
    <!-- Sidebar bên trái -->
    <aside style="width: 250px;">
      <AdminSidebar />
    </aside>

    <!-- Nội dung chính -->
    <main class="flex-grow-1 bg-light p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
 import AdminSidebar from './AdminSidebar.vue';
</script>
