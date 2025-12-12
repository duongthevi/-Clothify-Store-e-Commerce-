export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/view/AppLogin.vue'),
    meta: {
      title: 'Login',
    },
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('@/view/AppRegister.vue'),
    meta: {
      title: 'Register',
    },
  },

  {
    path: '/reset',
    name: 'ResetPassword',
    component: () => import('@/view/ConfirmResetPassword.vue'),
  },

  {
    path: '/update_profile',
    name: 'edit-profile',
    component: () => import('@/view/ProfileUpdate.vue'),
    meta: {
      requiresAuth: true,
    },
  },
]
