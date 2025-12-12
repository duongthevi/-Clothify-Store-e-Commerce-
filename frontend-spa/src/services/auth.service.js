import { efetch } from './efetch.service'
import { useAuthStore } from '@/stores/auth.store'
import { useOrderStore } from '@/stores/orders.store'

function makeAuthService() {
  const baseUrl = '/api/auth'

  async function register(user) {
    const authStore = useAuthStore()

    let options = {
      method: 'POST',
      headers: {},
      body: null,
    }

    if (user instanceof FormData) {
      options.body = user
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(user)
    }

    const response = await efetch(`${baseUrl}/register`, options)

    authStore.login(response.user, response.token, response.refreshToken)
    return response.user
  }

  async function login(login) {
    const authStore = useAuthStore()
    let options = {
      method: 'POST',
      headers: {},
      body: null,
    }

    if (login instanceof FormData) {
      options.body = login
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify(login)
    }

    const response = await efetch(`${baseUrl}/login`, options)

    authStore.login(response.user, response.token, response.refreshToken)

    return response.user
  }

  async function logout() {
    const authStore = useAuthStore()
    try {
      await efetch(`${baseUrl}/logout`, {
        method: 'POST',
        headers: authStore.authHeaders,
      })

      authStore.clear()
      useOrderStore.clear()
      authStore.logout()
    } catch (error) {
      console.error('Logout failed', error.message)
    } finally {
      window.dispatchEvent(new Event('token-changed'))
    }
  }

  async function refresh(token) {
    const authStore = useAuthStore()
    const refreshToken = authStore.refreshToken
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    let options = {
      method: 'POST',
      headers: authStore.authHeaders,
      body: JSON.stringify({ refreshToken }),
    }
    const response = await efetch(`${baseUrl}/refresh`, options)
    authStore.updateToken(response.token)
    // authStore.loadUserFromToken()
    return response.token
  }

  async function requestPasswordReset(email) {
    let options = {
      method: 'POST',
      headers: {},
      body: null,
    }

    if (email instanceof FormData) {
      options.body = email
    } else {
      options.headers['Content-Type'] = 'application/json'
      options.body = JSON.stringify({ email })
    }

    const res = await efetch(`${baseUrl}/req_reset`, options)
    return res.message
  }

  async function resetPassword(data) {
    const res = await efetch(`${baseUrl}/reset_pwd`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.message
  }

  return {
    register,
    login,
    logout,
    refresh,
    requestPasswordReset,
    resetPassword,
  }
}

export default makeAuthService()
