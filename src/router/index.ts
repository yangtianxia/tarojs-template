import createRouter from './core'
import routes from './routes'
import { ERROR_ROUTE } from './routes/basic'
import { jumpLogin } from '@/shared/jump-login'

const router = new createRouter([
  ...routes,
  ERROR_ROUTE
])

router.beforeEnter(({ path, query }) => {
  const code = router.getPermission(path)
  if (code === 401) {
    jumpLogin(path, query)
  }
  return code === 200
})

export default router
