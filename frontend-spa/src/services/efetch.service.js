import { useAuthStore } from '@/stores/auth.store'

async function efetch(url, options = {}, retry = true) {
  const requiresAuth = options.auth === true
  const authStore = useAuthStore()
  if (requiresAuth && authStore.isTokenExpired()) {
    const refreshed = await tryRefreshToken()
    if (!refreshed) throw new Error('Unauthorized - token expired')
  }
  const finalOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(requiresAuth ? authStore.authHeaders : {}),
    },
  }
  let result, json
  try {
    result = await fetch(url, finalOptions)
    json = await result.json()
  } catch (error) {
    throw new Error(`Fetch error: ${error.message}`)
  }
  if (requiresAuth && result.status === 401 && retry) {
    const refreshed = await tryRefreshToken()
    if (refreshed) return efetch(url, options, false)
    throw new Error('Unauthorized - token expired or invalid')
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message || 'Unknown error')
  }
  return json.data
}

async function tryRefreshToken() {
  const authStore = useAuthStore()
  const refreshToken = authStore.refreshToken
  if (!refreshToken) return false
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })
    const json = await response.json()
    const { token: newToken, refreshToken: newRefresh } = json?.data || {}
    if (json.status === 'success' && newToken && newRefresh) {
      authStore.updateToken(newToken)
      authStore.updateRefreshToken(newRefresh)
      return true
    }
  } catch (err) {
    console.error('Token refresh failed:', err.message)
  }
  return false
}

export { efetch, tryRefreshToken }
