<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResetPasswordStore } from '@/stores/reset_password.store'
import authService from '@/services/auth.service'

// Props và emits
defineProps({
  show: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'request-success'])

// State
const email = ref('')
const success = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const router = useRouter()
const resetStore = useResetPasswordStore()

// Gửi yêu cầu reset mật khẩu
const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    await authService.requestPasswordReset(email.value)
    success.value = true
    emit('request-success', email.value)
  } catch (error) {
    errorMessage.value = error?.message || 'Something went wrong!'
  } finally {
    loading.value = false
  }
}

// Đóng modal và reset
const closeModal = () => {
  emit('close')
  email.value = ''
  errorMessage.value = ''
  success.value = false
  if (resetStore.step === 'verify') {
    router.push({ name: 'ResetPassword' })
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show">
      <!-- Modal -->
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content border-0 rounded-4 shadow">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fa-solid fa-envelope-circle-check me-2"></i>
                Reset your password
              </h5>
              <button type="button" class="btn-close" @click="closeModal" />
            </div>

            <div class="modal-body">
              <div v-if="success" class="alert alert-success">
                A reset code has been sent to your email. Please check your inbox.
              </div>

              <form v-else @submit.prevent="submit">
                <div class="mb-3">
                  <label for="email" class="form-label">Enter your email</label>
                  <input
                    type="email"
                    v-model="email"
                    id="email"
                    class="form-control"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div v-if="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
                :disabled="loading"
              >
                <i class="fa-solid fa-xmark"></i>
                {{ success ? 'Done' : 'Close' }}
              </button>

              <button
                v-if="!success"
                type="button"
                class="btn btn-primary"
                @click="submit"
                :disabled="loading || !email"
              >
                <i class="fa-solid fa-paper-plane"></i>
                {{ loading ? 'Sending...' : 'Send Code' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal backdrop -->
      <div class="modal-backdrop fade show"></div>
    </div>
  </Teleport>
</template>
