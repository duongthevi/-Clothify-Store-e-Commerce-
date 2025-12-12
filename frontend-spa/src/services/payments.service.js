import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'

function makePaymentsService() {
  const API_URL = '/api/payments'

  async function getAll() {
    // Lấy authStore bên trong hàm để đảm bảo Pinia đã hoạt động
    const authStore = useAuthStore() 
    const data = await efetch(API_URL, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })
    data.payments = data.payments.map((payment) => ({
      ...payment,
    }))
    return data
  }

    async function getById(id) {
      // Lấy authStore bên trong hàm để đảm bảo Pinia đã hoạt động
      const authStore = useAuthStore() 
      const data = await efetch(`${API_URL}/${id}`, {
        method: 'GET',
        headers: authStore.authHeaders(),
      })
      return { ...data, payment: data.payment ? { ...data.payment } : null }
    }

    //get payment by user id
    async function getByUserId(userId, query = {}) {
      if (!userId) throw new Error('userId bị thiếu trong getByUserId()');

      const authStore = useAuthStore();
      
      const queryParams = new URLSearchParams(query).toString();
      const url = `${API_URL}/user/${userId}${queryParams ? '?' + queryParams : ''}`;

      const data = await efetch(url, {
        method: 'GET',
        headers: authStore.authHeaders(),
      });

      return data;
    }


  async function create(data) {
    // Lấy authStore bên trong hàm để đảm bảo Pinia đã hoạt động
    const authStore = useAuthStore() 
    let options = {
      method: 'POST',
      headers: authStore.authHeaders(),
      body: null,
    }
    if (data instanceof FormData) {
      options.body = data
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }
    return efetch(API_URL, options)
  }

  async function update(id, data) {
    // Lấy authStore bên trong hàm để đảm bảo Pinia đã hoạt động
    const authStore = useAuthStore() 
    let options = {
      method: 'PATCH',
      headers: authStore.authHeaders(),
      body: null,
    }
    if (data instanceof FormData) {
      options.body = data
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }
    return efetch(`${API_URL}/${id}`, options)
  }

  return {
    getAll,
    getById,
    getByUserId,
    create,
    update,
  }
}
export default makePaymentsService()