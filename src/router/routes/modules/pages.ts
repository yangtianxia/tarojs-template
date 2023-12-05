import type { RouteMeta } from '@/router/types'

export default [
  {
    name: 'pages',
    children: [
      {
        name: 'home',
        title: '主页',
        path: '/home/index',
        requiresAuth: false
      },
      {
        name: 'my',
        title: '我的',
        path: '/my/index',
        requiresAuth: false
      }
    ]
  }
] as RouteMeta[]
