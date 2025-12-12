<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResetPasswordStore } from '@/stores/reset_password.store'
import authService from '@/services/auth.service'

const router = useRouter()
const resetStore = useResetPasswordStore()

const dataReset = ref({
  email: resetStore.email,
  code: '',
  newPassword: '',
})

const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await authService.resetPassword({ 
      email: dataReset.value.email, 
      code: dataReset.value.code, 
      newPassword: dataReset.value.newPassword 
    })

    resetStore.clear()
    router.push({ name: 'Login' })
  } catch (err) {
    error.value = err?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  resetStore.step = 'email'
  router.back()
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
    <div class="card shadow-lg p-4" style="min-width: 360px; max-width: 420px;">
      <div class="card-body">
        <h4 class="card-title text-center mb-3">
          <i class="fas fa-key me-2"></i> Đặt lại mật khẩu
        </h4>

        <p class="text-center text-muted mb-4">
          Mã xác minh đã gửi đến: <strong>{{ dataReset.email }}</strong>
        </p>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div class="mb-3">
          <label class="form-label">Mã xác minh</label>
          <input v-model="dataReset.code" type="text" class="form-control" placeholder="Nhập mã xác minh" />
        </div>

        <div class="mb-4">
          <label class="form-label">Mật khẩu mới</label>
          <input v-model="dataReset.newPassword" type="password" class="form-control" placeholder="Nhập mật khẩu mới" />
        </div>

        <div class="d-flex justify-content-between">
          <button class="btn btn-outline-secondary" @click="goBack" :disabled="loading">
            <i class="fas fa-arrow-left"></i> Trở về
          </button>

          <button class="btn btn-primary" @click="handleSubmit" :disabled="loading">
            <i class="fas fa-check"></i> 
            {{ loading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
