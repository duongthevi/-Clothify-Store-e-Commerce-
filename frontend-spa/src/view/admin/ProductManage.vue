<script setup>
import { computed, watch, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuery, useQueryClient } from '@tanstack/vue-query'

import productsService from '@/services/products.service'
import categoriesService from '@/services/categories.service'

import { useProductsStore } from '@/stores/products.store'
import { useCategoriesStore } from '@/stores/categories.store'
import MainPagination from '@/components/ui/MainPagination.vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

const router = useRouter()
const route = useRoute()
const queryClient = useQueryClient()
const routePage = computed(() => Number(route.query.page) || 1)

watch(
  () => routePage.value,
  (page) => {
    if (!isNaN(page) && page > 0 && productsStore.currentPage !== page) {
      productsStore.setPage(page)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
    const res = await categoriesService.getAll()
    categoriesStore.setCategoriesData(res)
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
})

const { isLoading, isError, error } = useQuery({
  queryKey: computed(() => ['products', routePage.value]),
  queryFn: () => productsService.getAll(routePage.value),
  keepPreviousData: true,
  onSuccess: (res) => {
    productsStore.setProductsData(res)
  },
})

const products = computed(() => productsStore.products)
const selectedProduct = computed(() => productsStore.selectedProduct)
const totalPages = computed(() => productsStore.totalPages)
const currentPage = computed(() => routePage.value)

//Modal popup
const showEditModal = ref(false)
const showCreateModal = ref(false)

const newProduct = ref({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  size: '',
  image: null,
  category_id: '',
})

const editedProduct = ref(null)
const imageFile = ref(null)

function selectProduct(product) {
  productsStore.setSelectedProduct(product)
}
function createProduct(){
    showCreateModal.value = true
}
function editProduct() {
  if (selectedProduct.value) {
    editedProduct.value = { ...selectedProduct.value }
    imageFile.value = null
    showEditModal.value = true
  }
}
function handleCreateFileChange(event) {
  newProduct.value.image = event.target.files[0]
}

async function submitCreate() {
  const formData = new FormData()
  Object.entries(newProduct.value).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  try {
    console.log('[DEBUG] New product data:', newProduct.value)
    await productsService.create(formData)
    await queryClient.invalidateQueries({
      queryKey: ['products', routePage.value], // làm mới lại đúng trang hiện tại
    })
    alert('Tạo sản phẩm thành công!')
    showCreateModal.value = false
    // Reset form
    newProduct.value = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      size: '',
      image: null,
      category_id: '',
    }
  } catch (err) {
    console.error('Create error:', err)
    alert('Tạo sản phẩm thất bại.')
  }
}

function closeCreateModal() {
  showCreateModal.value = false
}

function closeEditModal() {
  showEditModal.value = false
}

function handleFileChange(event) {
  imageFile.value = event.target.files[0]
}

async function submitUpdate() {
  if (!editedProduct.value || !selectedProduct.value?.id) return

  const formData = new FormData()
  Object.entries(editedProduct.value).forEach(([key, value]) => {
    if (key !== 'id' && value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  if (imageFile.value) {
    formData.append('image', imageFile.value)
  }

  try {
    await productsService.update(selectedProduct.value.id, formData)
    await queryClient.invalidateQueries({
      queryKey: ['products', routePage.value],
    })
    alert('Cập nhật thành công!')
    showEditModal.value = false
  } catch (err) {
    console.error('Update error:', err)
    alert('Cập nhật thất bại.')
  }
}

async function deleteProduct() {
  if (!selectedProduct.value) return
  const confirmDelete = confirm(`Bạn có chắc chắn muốn xoá "${selectedProduct.value.name}"?`)
  if (!confirmDelete) return

  try {
    await productsService.remove(selectedProduct.value.id)
    await queryClient.invalidateQueries({ queryKey: ['products', routePage.value] })
    alert('Xoá sản phẩm thành công!')
    productsStore.setSelectedProduct(null)
  } catch (err) {
    console.error('Delete error:', err)
    alert('Xoá sản phẩm thất bại.')
  }
}

function changeCurrentPage(page) {
  if (page !== routePage.value) {
    router.push({ path: '/admin/products', query: { page } })
  }
}


</script>
<template>
  <div class="container py-4">
    <div class="row">
        <!-- Left: Product List -->
        <div class="col-md-4 border-end">
            <h4 class="mb-3">Product List</h4>

            <div v-if="isLoading" class="text-secondary py-3">
            <i class="fas fa-spinner fa-spin"></i> Loading...
            </div>

            <div v-else-if="isError" class="text-danger py-3">
            <i class="fas fa-exclamation-triangle"></i> Failed to load products.
            <div v-if="error?.message">{{ error.message }}</div>
            </div>

            <ul v-else class="list-group">
            <li
                v-for="product in products"
                :key="product.id"
                class="list-group-item list-group-item-action"
                :class="{ active: product.id === selectedProduct?.id }"
                @click="selectProduct(product)"
                role="button"
            >
                {{ product.name }}
            </li>
            </ul>

            <div class="mt-4 d-flex justify-content-center">
            <MainPagination
                :total-pages="totalPages"
                :current-page="currentPage"
                @update:current-page="changeCurrentPage"
            />
            </div>
        </div>

        <!-- Right: Product Detail -->
        <div class="col-md-8">
        <div v-if="selectedProduct" class="card">
          <img
            v-if="selectedProduct.image_url"
            :src="selectedProduct.image_url"
            class="card-img-top"
            alt="Product Image"
            style="max-height: 300px; object-fit: contain"
          />
          <div class="card-body">
            <h5 class="card-title">{{ selectedProduct.name }}</h5>
            <p class="card-text">{{ selectedProduct.description }}</p>
            <p><strong>Price:</strong> ${{ selectedProduct.price }}</p>
            <p><strong>Stock:</strong> {{ selectedProduct.stock }}</p>
            <p><strong>Stock:</strong> {{ selectedProduct.size }}</p>
            <div class="d-flex gap-2">
              <button class="btn btn-warning" @click="editProduct">
                <i class="fa-solid fa-pen-to-square"></i> Edit Product
              </button>
              <button class="btn btn-danger" @click="deleteProduct">
                <i class="fa-solid fa-trash"></i> Delete Product
              </button>
            </div>
          </div>
        </div>
            <div v-else class="alert alert-info mt-4">
                Please select a product to view details.
            </div>
        </div>
    </div>

        <!-- Button Create Product -->
    <div class="text-center mt-4">
      <button class="btn btn-primary" @click="createProduct">Add Product</button>
    </div>

        <!-- Modal: Edit Product -->
    <BaseModal :show="showEditModal" title="Chỉnh sửa sản phẩm" @close="closeEditModal">
      <template #default>
        <div v-if="editedProduct">
          <div class="mb-3">
            <label class="form-label">Tên sản phẩm</label>
            <input v-model="editedProduct.name" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Mô tả</label>
            <textarea v-model="editedProduct.description" class="form-control" rows="3" />
          </div>

          <div class="mb-3">
            <label class="form-label">Giá</label>
            <input v-model.number="editedProduct.price" type="number" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Số lượng (Stock)</label>
            <input v-model.number="editedProduct.stock" type="number" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Kích cỡ (Size)</label>
            <input v-model="editedProduct.size" type="text" class="form-control" />
          </div>

          <div class="mb-3">
            <label class="form-label">Ảnh sản phẩm mới (nếu có)</label>
            <input type="file" class="form-control" @change="handleFileChange" />
          </div>

          <div class="mb-3" v-if="editedProduct.image_url">
            <label class="form-label">Ảnh hiện tại:</label><br />
            <img :src="editedProduct.image_url" alt="Current image" style="max-height: 150px; object-fit: contain" />
          </div>
        </div>
      </template>
      <template #footer>
        <button class="btn btn-secondary" @click="closeEditModal">Hủy</button>
        <button class="btn btn-success" @click="submitUpdate">
          <i class="fa-solid fa-floppy-disk"></i> Lưu thay đổi
        </button>
      </template>
    </BaseModal>

        <!-- Modal: Create Product -->
    <BaseModal :show="showCreateModal" title="Tạo sản phẩm mới" @close="closeCreateModal">
        <template #default>
            <div>
            <div class="mb-3">
                <label class="form-label">Tên sản phẩm</label>
                <input v-model="newProduct.name" type="text" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Mô tả</label>
                <textarea v-model="newProduct.description" class="form-control" rows="3" />
            </div>

            <div class="mb-3">
                <label class="form-label">Giá</label>
                <input v-model.number="newProduct.price" type="number" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Số lượng (Stock)</label>
                <input v-model.number="newProduct.stock" type="number" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Kích cỡ (Size)</label>
                <input v-model="newProduct.size" type="text" class="form-control" />
            </div>

            <div class="mb-3">
                <label class="form-label">Ảnh sản phẩm</label>
                <input type="file" class="form-control" @change="handleCreateFileChange" />
            </div>

            <div class="mb-3">
                <label class="form-label">Danh mục</label>
                <select v-model="newProduct.category_id" class="form-select">
                    <option disabled value="">-- Chọn danh mục --</option>
                    <option
                        v-for="category in categoriesStore.categories"
                        :key="category.id"
                        :value="category.id"
                    >
                    {{ category.name }}
                    </option>
                </select>
            </div>

            </div>
        </template>

        <template #footer>
            <button class="btn btn-secondary" @click="closeCreateModal">Hủy</button>
            <button class="btn btn-primary" @click="submitCreate">
            <i class="fa-solid fa-plus"></i> Tạo sản phẩm
            </button>
        </template>
    </BaseModal>

  </div>
</template>
