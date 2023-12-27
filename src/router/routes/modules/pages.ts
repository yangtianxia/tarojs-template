import type { PageRoute } from '../../types'

export default [
  {
    name: 'pages',
    children: [
      {
        name: 'index',
        title: '首页',
        path: '/index/index',
        requiresAuth: false
      }
    ]
  }
] as PageRoute[]
