import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'

function makeCategoriesService() {
  const API_URL = '/api/categories'

  async function getAll() {
    const authStore = useAuthStore()
    const data = await efetch(API_URL, {
      headers: authStore.authHeaders(),
    })

    data.categories = data.categories.map((category) => ({
      ...category,
    }))
    return data
  }

  async function create(data) {
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

  async function remove(id) {
    const authStore = useAuthStore()
    let options = {
      method: 'DELETE',
      headers: authStore.authHeaders(),
    }
    return efetch(`${API_URL}/${id}`, options)
  }

  return {
    getAll,
    create,
    update,
    remove,
  }
}

export default makeCategoriesService()
