<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
  >
    <div
      class="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-xl space-y-5 animate-fade-in max-h-[90vh] overflow-y-auto"
    >

    <!-- Tổng tiền -->
      <div class="text-right text-lg font-semibold text-gray-700">
        Mã đơn hàng: <span class="text-blue-600">{{ derivedOrderIds.join(', ') }}</span>
        <br />
        Tổng tiền: {{ formatCurrency(totalAmount) }}
      </div>
      
      <!-- Tiêu đề -->
      <h2 class="text-2xl font-bold text-center text-gray-800">💳 Thanh toán đơn hàng</h2>

      

      <!-- Phương thức thanh toán -->
      <div class="space-y-3 text-center">
        <p class="font-medium">Chọn phương thức:</p>
        <div class="space-y-2">
          <label
            v-for="method in methods"
            :key="method.value"
            class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all"
            :class="{
              'border-blue-600 bg-blue-50': selectedMethod === method.value,
              'border-gray-300': selectedMethod !== method.value
            }"
          >
            <input
              type="radio"
              class="hidden"
              v-model="selectedMethod"
              :value="method.value"
            />
            <span class="text-gray-800">{{ method.label }}</span>
          </label>
        </div>
      </div>
      <br />

      

      <!-- Nút hành động -->
      <div class="flex justify-end text-center gap-3">
        <button
          @click="closeModal"
          class="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
        >
          Hủy
        </button>
        <button
          @click="submitPayment"
          :disabled="!selectedMethod || isProcessing"
          class="px-5 py-2 rounded bg-blue-600 text-black hover:bg-blue-700 disabled:opacity-50"
        >
          {{ isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePaymentStore } from '@/stores/payment.store'
import paymentsService from '@/services/payments.service'

// Props & Emits
const props = defineProps({
  isVisible: Boolean,
  orderItems: Array,
})
const emit = defineEmits(['update:isVisible', 'paymentSuccess', 'paymentFailed'])

// State
const selectedMethod = ref(null)
const isProcessing = ref(false)

// Store
const paymentStore = usePaymentStore()

// Phương thức thanh toán (không có icon)
const methods = [
  { label: 'Thanh toán khi nhận hàng (COD)', value: 'cash' },
  { label: 'Chuyển khoản ngân hàng', value: 'bank_transfer' },
]

// Lấy các order_id duy nhất
const derivedOrderIds = computed(() => {
  if (!props.orderItems || props.orderItems.length === 0) return []
  const ids = new Set()
  props.orderItems.forEach(item => {
    if (item.order_id) ids.add(item.order_id)
  })
  return Array.from(ids)
})

// Tính tổng tiền
const totalAmount = computed(() => {
  return (props.orderItems ?? []).reduce((total, item) => {
    const price = parseFloat(item.product_price ?? 0)
    return total + item.quantity * price
  }, 0)
})

// Tính tiền theo đơn hàng
const getOrderAmount = (orderId) => {
  return (props.orderItems ?? [])
    .filter(item => item.order_id === orderId)
    .reduce((total, item) => {
      const price = parseFloat(item.product_price ?? 0)
      return total + item.quantity * price
    }, 0)
}

// Format tiền
function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

// Đóng modal
function closeModal() {
  emit('update:isVisible', false)
  paymentStore.setPaymentStatus(null)
}

//  🟡 Tự động đóng modal nếu không còn đơn hàng
watch(
  () => props.orderItems,
  (newItems) => {
    if (!newItems || newItems.length === 0) {
      closeModal()
    }
  },
  { deep: true }
)


// Gửi thanh toán từng đơn
async function submitPayment() {
  if (!selectedMethod.value || derivedOrderIds.value.length === 0) return

  isProcessing.value = true
  paymentStore.setPaymentMethod(selectedMethod.value)
  paymentStore.setPaymentStatus('pending')

  try {
    for (const orderId of derivedOrderIds.value) {
      const amount = getOrderAmount(orderId)
      if (amount > 0) {
        await paymentsService.create({
          order_id: orderId,
          amount,
          payment_method: selectedMethod.value,
          status: 'pending',
        })
      }
    }

    paymentStore.setPaymentStatus('paid')
    emit('paymentSuccess')
    closeModal()
  } catch (err) {
    console.error('Lỗi khi thanh toán:', err)
    paymentStore.setPaymentStatus('failed')
    emit('paymentFailed')
  } finally {
    isProcessing.value = false
  }
}

// Reset modal khi mở lại
watch(() => props.isVisible, (val) => {
  if (val) {
    selectedMethod.value = null
    paymentStore.setPaymentStatus(null)
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}
</style>