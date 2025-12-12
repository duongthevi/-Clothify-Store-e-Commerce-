export default [
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/components/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresRole: 'admin',
    },
    children: [
      {
        path: '',
        name: 'AdminHome',
        component: () => import('@/view/admin/AdminHome.vue'),
      },
      {
        path: 'users',
        name: 'UserManage',
        component: () => import('@/view/admin/UserManage.vue'),
      },
      {
        path: 'products',
        name: 'ProductsManage',
        component: () => import('@/view/admin/ProductManage.vue'),
      },
      {
        path: 'categories',
        name: 'CategoriesManage',
        component: () => import('@/view/admin/CategoryManage.vue'),
      },
      {
        path: 'payments',
        name: 'PaymentsManage',
        component: () => import('@/view/admin/PaymentManage.vue'),
      },
    ],
  },
]
