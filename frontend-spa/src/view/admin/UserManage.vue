<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users.store'
import usersService from '@/services/users.service'

import UserList from '@/components/ui/UserList.vue'
import UserCard from '@/components/ui/UserCard.vue'
import MainPagination from '@/components/ui/MainPagination.vue'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()

const isLoading = ref(false)
const isError = ref(false)
const errorMessage = ref('')

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return Number.isNaN(page) || page < 1 ? 1 : page
})

async function fetchUsers(page = 1) {
  isLoading.value = true
  isError.value = false
  try {
    const res = await usersService.getAllUsers(page)
    usersStore.setUsersData(res)
  } catch (err) {
    isError.value = true
    errorMessage.value = err.message || 'Lỗi khi tải danh sách người dùng.'
  } finally {
    isLoading.value = false
  }
}

function handleSelectUser(user) {
  usersStore.setSelectedUser(user)
}

function handleUpdateUser(updatedUser) {
  usersStore.updateUserData(updatedUser)
}

function changePage(page) {
  router.push({ query: { ...route.query, page } })
}

watch(currentPage, fetchUsers, { immediate: true })
</script>

<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-6">
        <h5 class="mb-3">Danh sách người dùng</h5>

        <div v-if="isLoading" class="text-center py-3 text-secondary">
          <i class="fas fa-spinner fa-spin me-2"></i> Đang tải...
        </div>
        <div v-else-if="isError" class="alert alert-danger">
          {{ errorMessage }}
        </div>
        <div v-else>
          <UserList
            :users="usersStore.users"
            :selected-user-id="usersStore.selectedUser?.id"
            @select="handleSelectUser"
          />
        </div>

        <div class="mt-3 d-flex justify-content-center">
          <MainPagination
            :total-pages="usersStore.totalPages"
            :current-page="currentPage"
            @update:current-page="changePage"
          />
        </div>
      </div>

      <div class="col-md-6">
        <div v-if="usersStore.selectedUser">
          <UserCard
            :user="usersStore.selectedUser"
            @update="handleUpdateUser"
          />
        </div>
        <div v-else class="alert alert-light">Chọn một người dùng để xem chi tiết.</div>
      </div>
    </div>
  </div>
</template>
