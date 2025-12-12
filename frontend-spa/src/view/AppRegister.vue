<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';

const router = useRouter();

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user',
});

const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

async function handleRegister() {
  error.value = '';
  loading.value = true;

  try {
    await authService.register(form);
    router.push({ name: 'Home' });
  } catch (err) {
    error.value = err.message || 'Đăng ký thất bại';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="register-page d-flex justify-content-center align-items-start min-vh-100 bg-gradient mt-5">
    <div class="register-box row bg-white rounded-4 shadow overflow-hidden w-100" style="max-width: 900px;">
      <!-- Left -->
      <div class="col-md-6 p-4 p-md-5">
        <h4 class="text-dark fw-bold mb-3">Sign Up</h4>

        <form @submit.prevent="handleRegister">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <div class="mb-3">
            <label class="form-label">Name</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-user"></i></span>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="Your Name"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-envelope"></i></span>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-lock"></i></span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Create Password"
                required
              />
              <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                {{ showPassword ? 'HIDE' : 'SHOW' }}
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-success w-100 mb-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Sign Up
          </button>

          <p class="text-center small">
            Already have an account?
            <router-link to="/login" class="text-success fw-semibold">Sign In</router-link>
          </p>
        </form>
      </div>

      <!-- Right -->
      <div class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-success text-white p-4">
        <h2 class="fw-bold">WELCOME</h2>
        <p class="text-center">TO OUR SHOP</p>
        <p class="small text-center">
          Join us to explore a wide range of quality products tailored for you.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  background: linear-gradient(to right, #198754, #28a745);
}

.register-box {
  border-radius: 1.5rem;
}
</style>
