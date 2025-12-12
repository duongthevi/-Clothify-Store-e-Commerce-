import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'

function makeRoleService() {
  const baseUrl = '/api/roles'

  async function getRoleIdById(id) {
    const authStore = useAuthStore()
    return efetch(`${baseUrl}/${id}`, {
      headers: authStore.authHeaders(),
    })
  }

  async function getAllRoles() {
    const authStore = useAuthStore()
    const data = await efetch(baseUrl, {
      headers: authStore.authHeaders(),
    })

    data.roles = data.roles.map((role) => ({
      ...role,
    }))

    return data
  }

  async function createRole(role) {
    const authStore = useAuthStore()
    let options = {
      method: 'POST',
      headers: authStore.authHeaders(),
      body: null,
    }

    if (role instanceof FormData) {
      options.body = role
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(role)
    }

    return efetch(baseUrl, options)
  }

  async function updateRole(id, role) {
    const authStore = useAuthStore()
    let options = {
      method: 'PUT',
      headers: authStore.authHeaders(),
      body: null,
    }

    if (role instanceof FormData) {
      options.body = role
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(role)
    }

    return efetch(`${baseUrl}/${id}`, options)
  }

  async function deleteRole(id) {
    const authStore = useAuthStore()
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
      headers: authStore.authHeaders(),
    })
  }

  return {
    getRoleIdById,
    getAllRoles,
    createRole,
    updateRole,
    deleteRole,
  }
}

export default makeRoleService()
