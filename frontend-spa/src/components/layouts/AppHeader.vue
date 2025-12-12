<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '@/assets/images/logo.png'
import authService from '@/services/auth.service'
import { useAuthStore } from '@/stores/auth.store'


const router = useRouter()
const authStore = useAuthStore()
const token = ref(authStore.token)


function updateToken() {
  token.value = authStore.token
}

onMounted(() => {
  window.addEventListener('storage', updateToken)
  window.addEventListener('token-changed', updateToken)
})

onUnmounted(() => {
  window.removeEventListener('storage', updateToken)
  window.removeEventListener('token-changed', updateToken)
})

async function handleLogout() {
  try {
    await authService.logout()
    window.dispatchEvent(new Event('token-changed'))
    router.push({ name: 'Home' })
  } catch (err) {
    console.error('Đăng xuất thất bại:', err)
  }
}

function handleLogoClick() {
  const role = authStore.getRole()
  if (role === 'admin') router.push({ name: 'AdminHome' })
  else router.push({ name: 'Home' })

}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand d-flex align-items-center" href="#" @click.prevent="handleLogoClick">
        <img :src="Logo" alt="Logo" style="width: 80px; height: 80px; border-radius: 50%;" />
      </a>

        <!-- Right menu -->
        <ul class="navbar-nav ms-auto align-items-center gap-3 mt-3 mt-lg-0">
          <!-- Cart -->
          <li class="nav-item position-relative">
            <router-link class="nav-link" to="/cart">🛒</router-link>
          </li>

          <!-- Not logged in -->
          <template v-if="authStore.isAdmin === false && authStore.isLoggedIn === false">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Đăng nhập</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register">Đăng ký</router-link>
            </li>
          </template>

          <!-- Logged in -->
          <template v-else>
            <li class="nav-item dropdown">
              <button
                class="btn btn-outline-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Tài khoản
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link to="/profile" class="dropdown-item">Trang cá nhân</router-link>
                </li>
                <li>
                  <button class="dropdown-item" @click="handleLogout">Đăng xuất</button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
  </nav>
</template>
