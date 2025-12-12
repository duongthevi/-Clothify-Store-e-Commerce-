<script setup>
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { usePaymentStore } from '@/stores/payment.store'
import paymentsService from '@/services/payments.service'

const paymentStore = usePaymentStore()
const queryClient = useQueryClient()

const { isLoading, error } = useQuery({
  queryKey: ['payments'],
  queryFn: async () => {
    const data = await paymentsService.getAll()
    paymentStore.setPaymentsData({
      payments: data.payments,
      metadata: data.metadata ?? {},
    })
    return data
  },
})

const updatePaymentStatus = useMutation({
  mutationFn: ({ id, status }) => paymentsService.update(id, { status }),
  onSuccess: () => {
    queryClient.invalidateQueries(['payments'])
  },
  onError: (err) => {
    alert('Cập nhật trạng thái thất bại: ' + err.message)
  },
})

function onStatusChange(payment) {
  updatePaymentStatus.mutate({ id: payment.id, status: payment.status })
}
</script>

<template>
  <div class="container py-4">
    <h2 class="mb-4">Quản lý thanh toán</h2>

    <div v-if="isLoading" class="text-center my-4">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      Lỗi khi tải dữ liệu: {{ error.message }}
    </div>

    <table v-else class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>ID</th>
          <th>Đơn hàng</th>
          <th>Số tiền</th>
          <th>Phương thức</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="payment in paymentStore.allPayments" :key="payment.id">
          <td>{{ payment.id }}</td>
          <td>{{ payment.order_id }}</td>
          <td>{{ payment.amount.toLocaleString() }} đ</td>
          <td>{{ payment.payment_method }}</td>
          <td>
            <select
              class="form-select form-select-sm"
              v-model="payment.status"
              @change="onStatusChange(payment)"
            >
              <option value="pending">Đang xử lý</option>
              <option value="paid">Đã thanh toán</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </select>
          </td>
        </tr>
        <tr v-if="paymentStore.allPayments.length === 0">
          <td colspan="5" class="text-center text-muted">Không có thanh toán nào.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
