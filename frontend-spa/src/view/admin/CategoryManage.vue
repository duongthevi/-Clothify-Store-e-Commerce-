<script setup>
import { reactive, watch, computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useCategoriesStore } from '@/stores/categories.store'
import categoriesService from '@/services/categories.service'

const categoriesStore = useCategoriesStore()
const queryClient = useQueryClient()

const form = reactive({
  id: null,
  name: '',
})

const {
  isLoading,
  isError,
} = useQuery({
  queryKey: ['categories'],
  queryFn: () => categoriesService.getAll(),
  onSuccess(data) {
    categoriesStore.setCategoriesData(data)
  },
})

const categories = computed(() => categoriesStore.categories || [])

watch(
  () => categoriesStore.selectedCategory,
  (cat) => {
    if (cat) {
      form.id = cat.id
      form.name = cat.name
    } else {
      resetForm()
    }
  }
)

function selectCategory(category) {
  categoriesStore.setSelectedCategory(category)
}

function resetForm() {
  categoriesStore.setSelectedCategory(null)
  form.id = null
  form.name = ''
}

const { mutateAsync: createCategory, isPending: creating } = useMutation({
  mutationFn: (data) => categoriesService.create(data),
  onSuccess: async () => {
    await queryClient.invalidateQueries(['categories'])
    const data = await categoriesService.getAll()
    categoriesStore.setCategoriesData(data)
  },
})

const { mutateAsync: updateCategory, isPending: updating } = useMutation({
  mutationFn: ({ id, data }) => categoriesService.update(id, data),
  onSuccess: async () => {
    await queryClient.invalidateQueries(['categories'])
    const data = await categoriesService.getAll()
    categoriesStore.setCategoriesData(data)
  },
})

const { mutateAsync: deleteCategory } = useMutation({
  mutationFn: (id) => categoriesService.remove(id),
  onSuccess: async () => {
    await queryClient.invalidateQueries(['categories'])
    const data = await categoriesService.getAll()
    categoriesStore.setCategoriesData(data)
    resetForm()
  },
})


async function handleSubmit() {
  const payload = { name: form.name }
  if (form.id) {
    await updateCategory({ id: form.id, data: payload })
  } else {
    await createCategory(payload)
  }
  resetForm()
}

async function handleDelete(id) {
  if (confirm('Xác nhận xóa danh mục?')) {
    await deleteCategory(id)
  }
}

const isSubmitting = computed(() => creating.value || updating.value)
</script>


<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Danh sách categories -->
      <div class="col-md-5 border-end">
        <h5>Danh sách danh mục</h5>

        <ul class="list-group">
          <li
            v-for="cat in categories"
            :key="cat.id"
            class="list-group-item d-flex justify-content-between align-items-center"
            :class="{ active: categoriesStore.selectedCategory?.id === cat.id }"
            @click="selectCategory(cat)"
            style="cursor: pointer"
          >
            {{ cat.name }}
          </li>
        </ul>

        <div v-if="isLoading" class="text-muted mt-2">Đang tải danh mục...</div>
        <div v-if="isError" class="text-danger mt-2">Lỗi khi tải danh mục.</div>
      </div>

      <!-- Form thêm/sửa -->
      <div class="col-md-7">
        <h5>{{ form.id ? 'Chỉnh sửa' : 'Thêm mới' }} danh mục</h5>
        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Tên danh mục</label>
            <input v-model="form.name" type="text" class="form-control" required />
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
              {{ form.id ? 'Cập nhật' : 'Thêm mới' }}
            </button>
            <button class="btn btn-secondary" type="button" @click="resetForm">Hủy</button>
            <button class="btn btn-sm btn-outline-danger" @click.stop="handleDelete(cat.id)">Xóa</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


