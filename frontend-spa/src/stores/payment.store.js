import { defineStore } from 'pinia'

export const usePaymentStore = defineStore('payments', {
  state: () => ({
    selectedPaymentMethod: null,
    currentPaymentStatus: null,

    payments: [],
    metadata: {
      totalRecords: 0,
      page: 1,
      limit: 10,
      lastPage: 1,
    },
  }),
  getters: {
    getPaymentMethod: (state) => state.selectedPaymentMethod,
    getPaymentStatus: (state) => state.currentPaymentStatus,

    allPayments: (state) => state.payments,
    getMetadata: (state) => state.metadata,
  },
  actions: {
    setPaymentMethod(method) {
      this.selectedPaymentMethod = method
    },
    setPaymentStatus(status) {
      this.currentPaymentStatus = status
    },
    clearPaymentState() {
      this.selectedPaymentMethod = null
      this.currentPaymentStatus = null
    },

    setPaymentsData({ payments, metadata }) {
      this.payments = payments
      this.metadata = metadata
    },

    updatePaymentStatus(id, status) {
      const payment = this.payments.find((p) => p.id === id)
      if (payment) payment.status = status
    },

    clearPayments() {
      this.payments = []
      this.metadata = {
        totalRecords: 0,
        page: 1,
        limit: 10,
        lastPage: 1,
      }
    },
  },
})
