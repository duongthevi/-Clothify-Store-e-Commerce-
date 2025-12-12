import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'
import { useOrderStore } from '@/stores/orders.store'

function makeOrderService() {
  const API_URL = '/api/orders'

  async function getAllOrders(page, limit = 8) {
    const authStore = useAuthStore()
    const orderStore = useOrderStore()

    const url = `${API_URL}?page=${page}&limit=${limit}`
    const data = await efetch(url, {
      headers: authStore.authHeaders(),
    })

    orderStore.setOrdersData({
      orders: data.orders,
      metadata: data.metadata,
    })

    return data
  }

  async function getOrderById(id) {
    const authStore = useAuthStore()
    const orderStore = useOrderStore()

    const data = await efetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })

    orderStore.setSelectedOrder(data)
    return data
  }

  async function getOrdersByUserId(userId) {
    const authStore = useAuthStore()
    const orderStore = useOrderStore()

    const data = await efetch(`${API_URL}/user/${userId}`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })

    orderStore.setOrdersData({
      orders: data.orders,
      metadata: data.metadata,
    })

    return data
  }

  //getAllOrderItemsByOrderId
  async function getAllOrderItemsByOrderId(orderId, page = 1, limit = 5) {
    const authStore = useAuthStore()
    const cart = useOrderStore()

    const res = await efetch(`${API_URL}/${orderId}/items?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })

    if (!res || !Array.isArray(res.order_items)) {
      console.warn('Dữ liệu không hợp lệ:', res)
      cart.items = []
      return []
    }

    return res.order_items
  }

  async function createOrder(payload) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}`, {
      method: 'POST',
      headers: authStore.authHeaders(),
      body: JSON.stringify(payload),
    })
  }

  async function createOrderItem(orderId, payload) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/${orderId}/items`, {
      method: 'POST',
      headers: authStore.authHeaders(),

      body: JSON.stringify(payload),
    })
  }

  async function updateOrder(orderId, payload) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/${orderId}`, {
      method: 'PUT',
      headers: authStore.authHeaders(),

      body: JSON.stringify(payload),
    })
  }

  async function updateOrderItem(orderItemId, payload) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/order_items/${orderItemId}`, {
      method: 'PUT',
      headers: authStore.authHeaders(),

      body: JSON.stringify(payload),
    })
  }

  async function deleteOrderItem(orderItemId) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/order_items/${orderItemId}`, {
      method: 'DELETE',
      headers: authStore.authHeaders(),
    })
  }

  return {
    getAllOrders,
    getOrderById,
    getOrdersByUserId,
    getAllOrderItemsByOrderId,
    createOrder,
    createOrderItem,
    updateOrder,
    updateOrderItem,
    deleteOrderItem,
  }
}

export default makeOrderService()
