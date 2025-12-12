import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    authHeaders:
      (state) =>
      (isFormData = false) => {
        const headers = {
          Authorization: `Bearer ${state.token}`,
        }
        if (!isFormData) {
          headers['Content-Type'] = 'application/json'
        }
        return headers
      },
  },

  actions: {
    login(user, token, refreshToken) {
      this.user = user
      this.token = token
      this.refreshToken = refreshToken
      localStorage.setItem('token', token)
      localStorage.setItem('refreshToken', refreshToken)
      this.loadUserFromToken()
      window.dispatchEvent(new Event('token-changed'))
    },

    logout() {
      this.clear()
      window.dispatchEvent(new Event('token-changed'))
    },

    setUser(user) {
      this.user = user
    },

    updateToken(newToken) {
      this.token = newToken
      localStorage.setItem('token', newToken)
      this.loadUserFromToken()
      window.dispatchEvent(new Event('token-changed'))
    },

    updateRefreshToken(newRefreshToken) {
      this.refreshToken = newRefreshToken
      localStorage.setItem('refreshToken', newRefreshToken)
      window.dispatchEvent(new Event('token-changed'))
    },

    clear() {
      this.user = null
      this.token = ''
      this.refreshToken = ''
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    },

    getPayloadFromToken() {
      if (!this.token) return null
      try {
        return jwtDecode(this.token)
      } catch (err) {
        console.warn('Invalid token:', err)
        return null
      }
    },

    isTokenExpired() {
      const payload = this.getPayloadFromToken()
      if (!payload?.exp) return true
      return Date.now() >= payload.exp * 1000
    },

    getRole() {
      const payload = this.getPayloadFromToken()
      return payload?.role || null
    },

    loadUserFromToken() {
      const payload = this.getPayloadFromToken()
      if (payload) {
        this.user = {
          id: payload.id,
          name: payload.name,
          email: payload.email,
          role: payload.role,
        }
      } else {
        this.user = null
      }
    },
  },
})
