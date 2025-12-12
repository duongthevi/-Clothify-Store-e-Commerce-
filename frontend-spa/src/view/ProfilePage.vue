  <script setup>
  import { computed, ref, watch } from 'vue'
  import { useQuery } from '@tanstack/vue-query'
  import usersService from '@/services/users.service'
  import paymentsService from '@/services/payments.service'
  import orderService from '@/services/order.service'
  import { useRouter } from 'vue-router'
  import ResetPassword from './ResetPassword.vue'
  import { useResetPasswordStore } from '@/stores/reset_password.store'
  import MainPagination from '@/components/ui/MainPagination.vue'


  const router = useRouter()
  const resetPasswordStore = useResetPasswordStore()
  const showResetModal = ref(false)

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => usersService.getMyInfo()
  })

  const user = computed(() => data.value?.user || {})

  function editProfile() {
    router.push({ name: 'edit-profile' })
  }

  function requestCode() {
    showResetModal.value = true
  }

  function handleResetSuccess(email) {
    resetPasswordStore.setEmail(email)
  }

  // 🧾 Payment history logic
  const payments = ref([])
  const loadingPayments = ref(false)
  const page = ref(1)
  const limit = ref(5)
  const totalPages = ref(1)

  watch(
    [() => user.value?.id, page],
    async ([userId, currentPage]) => {
      if (!userId) {
        console.warn('Chưa có user id, không thể load payment')
        return
      }

      loadingPayments.value = true
      try {
        const res = await paymentsService.getByUserId(userId, {
          page: currentPage,
          limit: limit.value,
        })

        const allPayments = res.payments || []
        totalPages.value = res.metadata?.lastPage || 1

        await Promise.all(
          allPayments.map(async (payment) => {
            if (!payment.order_id) return

            const items = await orderService.getAllOrderItemsByOrderId(payment.order_id)
            payment.items = items.map(item => ({
              id: item.id,
              quantity: item.quantity,
              price: item.price || 0,
              product_name: item.product_name || item.product?.name || 'Sản phẩm không rõ',
            }))
          })
        )

        payments.value = allPayments
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu payments:', err)
      } finally {
        loadingPayments.value = false
      }
    },
    { immediate: true }
  )


  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleString('vi-VN')
  }

  function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}
  </script>

  <template>
    <div class="container py-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h4 class="card-title mb-4">
            Hồ sơ cá nhân <i class="fas fa-user-circle ms-2"></i>
          </h4>

          <div v-if="isLoading" class="text-center py-4">
            <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin...
          </div>

          <div v-else-if="isError" class="text-danger py-4">
            <i class="fas fa-exclamation-triangle"></i> Không thể tải hồ sơ!
            <div v-if="error?.message" class="mt-2">Chi tiết: {{ error.message }}</div>
          </div>

          <div v-else>
            <!-- Thông tin cá nhân -->
            <ul class="list-group list-group-flush">
              <li class="list-group-item"><strong>Họ tên:</strong> {{ user.name }}</li>
              <li class="list-group-item"><strong>Email:</strong> {{ user.email }}</li>
              <li class="list-group-item"><strong>Vai trò:</strong> {{ user.role }}</li>
              <li class="list-group-item"><strong>Địa chỉ:</strong> {{ user.address }}</li>
              <li class="list-group-item"><strong>Số điện thoại:</strong> {{ user.phone_number }}</li>
            </ul>

            <div class="mt-4 d-flex gap-3">
              <button class="btn btn-primary" @click="editProfile">
                <i class="fas fa-edit"></i> Chỉnh sửa
              </button>

              <button class="btn btn-outline-secondary" @click="requestCode">
                <i class="fas fa-key"></i> Đổi mật khẩu
              </button>

              <ResetPassword
                :show="showResetModal"
                @close="showResetModal = false"
                @request-success="handleResetSuccess"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 🧾 Payment History -->
      <div class="card shadow-sm mt-5">
        <div class="card-body">
          <h5 class="card-title mb-3">🧾 Lịch sử thanh toán</h5>

          <div v-if="payments.length === 0" class="text-muted">
            Không có giao dịch nào.
          </div>

          <div v-for="payment in payments" :key="payment.id" class="border rounded p-3 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div>
                <strong>Thanh toán #{{ payment.id }}</strong>
                <div class="text-muted small">Ngày: {{ formatDate(payment.created_at) }}</div>
              </div>
              <span
                class="badge"
                :class="{
                  'bg-success': payment.status === 'paid',
                  'bg-warning text-dark': payment.status === 'pending',
                  'bg-danger': payment.status === 'failed',
                  'bg-info': payment.status === 'refunded',
                }"
              >
                {{ payment.status }}
              </span>
            </div>

            <div>
              <strong>Sản phẩm:</strong>
              <ul class="mb-0">
                <li v-for="item in payment.items" :key="item.id" class="d-flex justify-content-between">
                  <span>{{ item.product_name }} × {{ item.quantity }}</span>
                  <span>{{ formatCurrency(payment.amount) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <MainPagination
          v-if="totalPages > 1"
          :current-page="page"
          :total-pages="totalPages"
          @update:current-page="page = $event"
        />
      </div>
    </div>
    
  </template>

  <style scoped>
  .card {
    max-width: 700px;
    margin: 0 auto;
  }
  </style>