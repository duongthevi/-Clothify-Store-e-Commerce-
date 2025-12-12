<script setup>
import { useRouter } from 'vue-router'
import notFoundImg from '@/assets/images/404.png' // hoặc ảnh bạn vừa upload

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <div class="not-found-page d-flex flex-column align-items-center justify-content-center text-center py-5">
    <!-- Ảnh lỗi 404 -->
    <img
      :src="notFoundImg"
      alt="404 Not Found"
      class="img-fluid mb-4"
      style="max-width: 600px;"
    />

    <!-- Dòng mô tả -->
    <p class="fs-4 fw-semibold mb-4">Oops! Không thể tìm thấy trang.</p>

    <!-- Hai nút -->
    <div class="d-flex gap-3 flex-wrap justify-content-center">
      <router-link to="/" class="btn btn-primary">Trang chủ</router-link>
      <button class="btn btn-outline-secondary" @click="goBack">Quay lại</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 80vh;
}
</style>
