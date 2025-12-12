<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import productsService from '@/services/products.service'
import orderService from '@/services/order.service'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'
import { useProductsStore } from '@/stores/products.store'

const authStore = useAuthStore()
const productStore = useProductsStore()
const route = useRoute()
const productId = route.params.id

const quantity = ref(1)

const {
  data,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ['product', productId],
  queryFn: async () => {
    const product = await productsService.getProductById(productId)
    productStore.setSelectedProduct(product)
    return product
  },
  staleTime: 1000 * 60,
})

const product = computed(() => data.value || productStore.selectedProduct || {})
const userRole = computed(() => authStore.getRole())

async function confirmAddToCart() {
  if (product.value.stock === 0) {
    alert('Sản phẩm này đã hết hàng.')
    return
  }

  const confirmed = confirm(`Bạn có chắc chắn muốn thêm ${quantity.value} sản phẩm "${product.value.name}" vào giỏ hàng không?`)
  if (!confirmed) return

  try {
    const orderPayload = {
      user_id: authStore.user.id,
      status: 'pending',
      order_items: [
        {
          product_id: product.value.id,
          quantity: quantity.value,
        },
      ],
    }

    const createdOrder = await orderService.createOrder(orderPayload)
    console.log('✅ Đơn hàng đã tạo:', createdOrder)

    alert('Đã thêm vào giỏ hàng thành công!')
    router.push({ name: 'Home' })
  } catch (err) {
    console.error('❌ Lỗi khi thêm vào giỏ hàng:', err)
    alert('Đã xảy ra lỗi khi thêm vào giỏ hàng!')
  }
}

function goToEdit() {
  router.push({ name: 'ProductEdit', params: { id: product.value.id } })
}
</script>

<template>
  <div class="container py-5">
    <div v-if="isLoading" class="text-center py-4">
      <i class="fas fa-spinner fa-spin"></i> Đang tải sản phẩm...
    </div>

    <div v-else-if="isError" class="text-danger py-4 text-center">
      <i class="fas fa-exclamation-circle"></i> Không thể tải sản phẩm.
      <div>{{ error?.message }}</div>
    </div>

    <div v-else class="row g-5 align-items-center">
      <!-- Ảnh sản phẩm -->
      <div class="col-md-6 text-center">
        <img
          :src="product.image_url"
          alt="Product Image"
          class="img-fluid rounded shadow-sm"
          style="max-height: 400px"
        />
      </div>

      <!-- Thông tin sản phẩm -->
      <div class="col-md-6">
        <h2>{{ product.name }}</h2>
        <p class="text-muted">{{ product.description }}</p>
        <p><strong>Số Lượng:</strong> {{ product.stock }}</p>
        <p class="fs-4 text-primary"><strong>Đơn Giá: </strong>{{ product.price }}</p>

        <div v-if="userRole === 'user'">
          <div class="mb-3">
            <label for="quantity" class="form-label">Chọn số lượng:</label>
            <input
              type="number"
              id="quantity"
              v-model.number="quantity"
              :max="product.stock"
              min="1"
              class="form-control"
              style="max-width: 200px"
            />
          </div>

          <button
            class="btn btn-success"
            :disabled="product.stock === 0 || quantity < 1 || quantity > product.stock"
            @click="confirmAddToCart"
          >
            <i class="fas fa-cart-plus me-2"></i> Thêm vào giỏ hàng
          </button>
        </div>

        <div v-else-if="userRole === 'admin'">
          <button class="btn btn-warning mt-3" @click="goToEdit">
            <i class="fas fa-edit me-2"></i> Chỉnh sửa sản phẩm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
