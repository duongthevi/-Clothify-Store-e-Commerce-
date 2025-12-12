<template>
  <div class="container" style="max-width: 960px; margin: 0 auto; padding: 20px;">
    <h2 style="text-align: center; margin-bottom: 20px;">🛒 Giỏ hàng của bạn (Đơn hàng đang chờ xử lý)</h2>

    <div v-if="!cart.selectedOrderItems || cart.selectedOrderItems.length === 0" class="alert alert-info">
      Giỏ hàng của bạn đang trống hoặc không có mặt hàng nào trong đơn hàng đang chờ xử lý.
    </div>

    <div v-else>
      <div v-if="showNotification" :class="['alert', notificationType]" style="text-align: center;">
        {{ notificationMessage }}
      </div>

      <table class="table" style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f8f9fa;">
            <th>Sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Đơn giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.selectedOrderItems" :key="item.id" style="border-bottom: 1px solid #ddd;">
            <td>{{ item.product_name }}</td>
            <td>
              <img
                :src="item.product_image_url || 'https://placehold.co/50x50/cccccc/ffffff?text=No+Image'"
                alt="Image"
                style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"
              />
            </td>
            <td>{{ formatCurrency(parseFloat(item.product_price)) }}</td>
            <td>
              <div class="input-group" style="display: flex; max-width: 140px;">
                <button class="btn btn-outline-secondary" @click="decrease(item)" :disabled="item.quantity <= 1">−</button>
                <input type="number" class="form-control" v-model.number="item.quantity" min="1" @change="updateQuantity(item)" style="width: 50px; text-align: center;" />
                <button class="btn btn-outline-secondary" @click="increase(item)">+</button>
              </div>
            </td>
            <td>{{ formatCurrency(item.quantity * parseFloat(item.product_price)) }}</td>
            <td>
              <button class="btn btn-danger btn-sm" @click="removeItem(item)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 1rem;">
        <h5>
          Tổng cộng:
          <span class="text-danger">{{ formatCurrency(totalAmount) }}</span>
        </h5>
        <button class="btn btn-success mt-2" @click="openPaymentModal">Tiến hành thanh toán</button>
      </div>
    </div>

    <PaymentModal 
      :isVisible="showPaymentModal"
      :orderItems="cart.selectedOrderItems"
      @update:isVisible="showPaymentModal = $event"
      @paymentSuccess="handlePaymentSuccess"
      @paymentFailed="handlePaymentFailed"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders.store'
import { useAuthStore } from '@/stores/auth.store'
import orderService from '@/services/order.service'
import PaymentModal from '@/view/PaymentUI.vue' // Adjust the path if you moved it

const authStore = useAuthStore()
const cart = useOrderStore()
const router = useRouter()

const notificationMessage = ref('')
const showNotification = ref(false)
const notificationType = ref('alert-danger')
const notificationTimeout = ref(null)
const showPaymentModal = ref(false) // State to control modal visibility

function displayNotification(message, type = 'alert-danger', duration = 3000) {
  if (notificationTimeout.value) clearTimeout(notificationTimeout.value)
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  notificationTimeout.value = setTimeout(() => {
    showNotification.value = false
    notificationMessage.value = ''
  }, duration)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

async function fetchCartData() {
  const userId = authStore.user?.id
  if (!userId) {
    cart.clearCart()
    return
  }
  try {
    await orderService.getOrdersByUserId(userId)
    let fetchedOrders = cart.orders.filter(order => order.status === 'not_ordered')

    if (!fetchedOrders) {
      fetchedOrders = []
    } else if (!Array.isArray(fetchedOrders)) {
      if (fetchedOrders.orders && Array.isArray(fetchedOrders.orders)) {
        fetchedOrders = fetchedOrders.orders
      } else {
        fetchedOrders = [fetchedOrders]
      }
    }

    let allOrderItems = []

    for (const order of fetchedOrders) {
      try {
        const res = await orderService.getAllOrderItemsByOrderId(order.id)
        if (Array.isArray(res)) {
          allOrderItems = allOrderItems.concat(res)
        } else if (Array.isArray(res.order_items)) {
          allOrderItems = allOrderItems.concat(res.order_items)
        }
      } catch (err) {
        console.error(`Lỗi khi tải mặt hàng cho đơn hàng ID ${order.id}:`, err)
      }
    }

    cart.setSelectedOrderItems(allOrderItems)
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu giỏ hàng:', error)
    displayNotification('Lỗi khi tải dữ liệu giỏ hàng. Vui lòng thử lại.', 'alert-danger')
  }
}

onMounted(() => {
  authStore.loadUserFromToken();
})

watch(() => authStore.user?.id, async () => {
  await fetchCartData()
}, { immediate: true })

const totalAmount = computed(() =>
  (cart.selectedOrderItems ?? []).reduce((total, item) => {
    const price = parseFloat(item.product_price ?? 0)
    return total + item.quantity * price
  }, 0)
)

const orderIds = computed(() => {
  const ids = new Set()
  for (const item of cart.selectedOrderItems ?? []) {
    if (item.order_id) ids.add(item.order_id)
  }
  return Array.from(ids)
})

function openPaymentModal() {
  if (orderIds.value.length === 0) {
    displayNotification('Không tìm thấy đơn hàng để thanh toán.', 'alert-warning')
    return
  }
  showPaymentModal.value = true
}

function handlePaymentSuccess() {
  displayNotification('Thanh toán thành công!', 'alert-success');
  fetchCartData(); // Re-fetch cart data to update display
  router.push({ name: 'Home' }); // Or navigate to a thank you page
}

function handlePaymentFailed() {
  displayNotification('Thanh toán thất bại. Vui lòng thử lại.', 'alert-danger');
}

async function updateQuantity(item) {
  if (item.quantity < 1) item.quantity = 1

  const stock = item.product_stock ?? Infinity
  if (item.quantity > stock) {
    displayNotification(`Số lượng vượt tồn kho (${stock}). Đã điều chỉnh lại.`, 'alert-warning')
    item.quantity = stock
    return
  }

  try {
    await orderService.updateOrderItem(item.id, { quantity: item.quantity })
    await fetchCartData()
  } catch (error) {
    console.error('Lỗi khi cập nhật số lượng:', error)
    displayNotification('Cập nhật thất bại. Vui lòng thử lại.', 'alert-danger')
  }
}

function increase(item) {
  const stock = item.product_stock ?? Infinity
  if (item.quantity >= stock) {
    displayNotification(`Không thể tăng thêm. Tồn kho chỉ còn ${stock}.`, 'alert-warning')
    item.quantity = stock
    return
  }
  item.quantity++
  updateQuantity(item)
}

function decrease(item) {
  if (item.quantity > 1) {
    item.quantity--
    updateQuantity(item)
  }
}

async function removeItem(item) {
  if (confirm(`Xác nhận xóa "${item.product_name}" khỏi giỏ hàng?`)) {
    try {
      await orderService.deleteOrderItem(item.id)
      displayNotification(`Đã xóa "${item.product_name}".`, 'alert-success')
      await fetchCartData()
    } catch (error) {
      console.error('Lỗi khi xóa mặt hàng:', error)
      displayNotification('Xóa thất bại. Vui lòng thử lại.', 'alert-danger')
    }
  }
}
</script>

<style scoped>
/* giữ nguyên các style của bạn như cũ */
</style>  