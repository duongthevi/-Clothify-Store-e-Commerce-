import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

import authRoutes from './auth.router'
import adminRoutes from './admin.router'
import AppHome from '@/view/HomePage.vue'
import NotFoundPage from '@/view/NotFound.vue'
import ProductDetail from '@/view/ProductDetail.vue'
import CartPage from '@/view/CartPage.vue'
import { tryRefreshToken } from '@/services/efetch.service'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AppHome,
  },
  ...authRoutes,
  ...adminRoutes,
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/view/ProfilePage.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
  },

  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  const requiresAuth = to.meta.requiresAuth === true
  const requiredRole = to.meta.requiresRole || null

  if (requiresAuth) {
    if (!auth.isLoggedIn || auth.isTokenExpired()) {
      const originalPath = to.fullPath
      let redirectedToLogin = false

      try {
        console.log('Token expired or not logged in. Attempting to refresh token...')
        const refreshed = await tryRefreshToken()

        if (!refreshed) {
          auth.logout()
          redirectedToLogin = true
          return next({ name: 'Login', query: { redirect: originalPath } })
        }
      } catch (error) {
        console.error('Error during token refresh:', error)
        auth.logout()
        redirectedToLogin = true
        return next({ name: 'Login', query: { redirect: originalPath } })
      }

      if (!redirectedToLogin) {
        if (!auth.isLoggedIn) {
          return next({ name: 'Login', query: { redirect: originalPath } })
        }
      }
    }

    if (requiredRole && auth.getRole() !== requiredRole) {
      return next({ name: 'Home' })
    }
  }
  next()
})

export default router
