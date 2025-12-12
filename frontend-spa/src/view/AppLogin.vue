<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/auth.service';

const router = useRouter();

const form = reactive({
  email: '',
  password: '',
});
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

async function handleLogin() {
  error.value = '';
  loading.value = true;
  try {
    const user = await authService.login(form);

    if (user.role === 'admin') {
      router.push({ name: 'AdminHome' });
    } else {
      router.push({ name: 'Home' });
    }
  } catch (err) {
    error.value = err.message || 'Đăng nhập thất bại';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page d-flex justify-content-center align-items-start min-vh-100 bg-gradient mt-5">
    <div class="login-box row bg-white rounded-4 shadow overflow-hidden w-100" style="max-width: 900px;">
      <!-- Left -->
      <div class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white p-4">
        <h2 class="fw-bold">WELCOME BACK</h2>
        <p class="text-center">TO OUR SHOP</p>
        <p class="small text-center">
          Join us to explore a wide range of quality products tailored for you.
        </p>
      </div>

      <!-- Right -->
      <div class="col-md-6 p-4 p-md-5">
        <h4 class="text-dark fw-bold mb-3">Sign in</h4>

        <form @submit.prevent="handleLogin">
          <div v-if="error" class="alert alert-danger">{{ error }}</div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-user"></i></span>
              <input
                v-model="form.email"
                type="text"
                class="form-control"
                placeholder="User Name"
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
                placeholder="Password"
                required
              />
              <button type="button" class="btn btn-outline-secondary" @click="showPassword = !showPassword">
                {{ showPassword ? 'HIDE' : 'SHOW' }}
              </button>
            </div>
          </div>

          <div class="d-flex justify-content-between mb-3">
            <a href="/reset" class="text-decoration-none small">Forgot Password?</a>
          </div>

          <button type="submit" class="btn btn-primary w-100 mb-3" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Sign in
          </button>

          <p class="text-center small">
            Don’t have an account?
            <router-link to="/register" class="text-primary fw-semibold">Sign Up</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: linear-gradient(to right, #007bff, #0d6efd);
}

.login-box {
  border-radius: 1.5rem;
}
</style>
