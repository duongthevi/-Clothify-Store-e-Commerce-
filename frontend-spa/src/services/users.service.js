import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'

function makeUserService() {
  const API_URL = '/api/users'

  async function getMyInfo() {
    const authStore = useAuthStore()
    const data = await efetch(`${API_URL}/me`, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })
    return { ...data, user: data.user ? { ...data.user } : null }
  }
  async function getAllUsers() {
    const authStore = useAuthStore()
    const data = await efetch(API_URL, {
      method: 'GET',
      headers: authStore.authHeaders(),
    })
    return { ...data, users: data.users ? [...data.users] : [] }
  }

  async function updateMyInfo(data) {
    const authStore = useAuthStore()
    let options = {
      method: 'PUT',
      headers: authStore.authHeaders(),
      body: null,
    }
    if (data instanceof FormData) {
      options.body = data
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(data)
    }
    return efetch(`${API_URL}/me`, options)
  }

  async function updateUser(id, data) {
    const authStore = useAuthStore()
    let options = {
      method: 'PUT',
      headers: authStore.authHeaders(),
      body: JSON.stringify(data),
    }
    return efetch(`${API_URL}/${id}`, options)
  }

  async function deleteUser(id) {
    const authStore = useAuthStore()
    return efetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: authStore.authHeaders(),
    })
  }
  return {
    getMyInfo,
    getAllUsers,
    updateMyInfo,
    updateUser,
    deleteUser,
  }
}
export default makeUserService()
