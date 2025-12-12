<script setup>
import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import usersService from '@/services/users.service'
import { useRouter } from 'vue-router'

const router = useRouter()
const queryClient = useQueryClient()

// Form fields
const name = ref('')
const address = ref('')
const phone = ref('')
const message = ref('')
const submitting = ref(false)

// Get current user info
const {
  data,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['user-profile'],
  queryFn: () => usersService.getMyInfo(),
})

const user = computed(() => data.value?.user || {})

// Gán dữ liệu vào form khi load thành công
watch(user, (val) => {
  name.value = val.name || ''
  address.value = val.address || ''
  phone.value = val.phone_number || ''
}, { immediate: true })

// Update mutation
const updateProfile = useMutation({
  mutationFn: (payload) => usersService.updateMyInfo(payload),
  onMutate: () => {
    submitting.value = true
    message.value = ''
  },
  onSuccess: () => {
    message.value = 'Cập nhật thành công!'
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
    setTimeout(() => {
      router.push({ name: 'Profile' })
    }, 1500)
  },
  onError: (err) => {
    message.value = 'Lỗi khi cập nhật: ' + (err?.message || 'Không xác định')
  },
  onSettled: () => {
    submitting.value = false
  }
})

// Gửi form
function handleSubmit() {
  updateProfile.mutate({
    name: name.value,
    address: address.value,
    phone_number: phone.value,
  })
}
</script>

<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="card-title mb-4">
          Cập nhật hồ sơ <i class="fas fa-user-edit ms-2"></i>
        </h4>

        <!-- Loading -->
        <div v-if="isLoading" class="text-center py-4">
          <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>

        <!-- Error -->
        <div v-else-if="isError" class="text-danger py-4">
          <i class="fas fa-exclamation-triangle"></i> Không thể tải thông tin!
          <div v-if="error?.message" class="mt-2">Chi tiết: {{ error.message }}</div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" v-else>
          <div v-if="message" class="alert alert-info text-center">{{ message }}</div>

          <div class="mb-3">
            <label class="form-label">Tên</label>
            <input v-model="name" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Địa chỉ</label>
            <input v-model="address" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Số điện thoại</label>
            <input v-model="phone" type="text" class="form-control" />
          </div>

          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-secondary" @click="router.back()">Hủy</button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <i class="fas fa-save"></i> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
