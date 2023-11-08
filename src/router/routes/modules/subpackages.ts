import type { RouteMeta } from '@/router/types'

export default [
  {
    name: 'subpackages',
    children: [
      {
        name: 'login',
        title: '登录',
        path: '/login/index',
        requiresAuth: false
      }
    ]
  }
] as RouteMeta[]
