import type { RouteMeta } from '@/router/types'

export default [
  {
    name: 'pages',
    children: [
      {
        name: 'home',
        title: '主页',
        path: '/home/index'
      }
    ]
  }
] as RouteMeta[]
