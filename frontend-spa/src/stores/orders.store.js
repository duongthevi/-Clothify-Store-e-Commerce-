import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 8,
    },
    selectedOrder: null,
    selectedOrderItems: [],
  }),

  getters: {
    totalPages(state) {
      return state.metadata.lastPage
    },
    currentPage(state) {
      return state.metadata.page
    },
  },
  actions: {
    setOrdersData({ orders, metadata }) {
      this.orders = orders
      this.metadata = metadata
    },

    setSelectedOrder(order) {
      this.selectedOrder = order
    },

    setSelectedOrderItems(items) {
      this.selectedOrderItems = items
    },

    // Đổi tên từ 'clear()' thành 'clearCart()' để nhất quán
    clearCart() { 
      this.orders = []
      this.metadata = {
        totalRecords: 0,
        firstPage: 1,
        lastPage: 1,
        page: 1,
        limit: 8,
      }
      this.selectedOrder = null
      this.selectedOrderItems = []
    },
  },
})