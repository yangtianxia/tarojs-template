import createRouter from './router'
import routes from './routes'
import { ERROR_ROUTE } from './routes/base'

const router = new createRouter([
  ...routes,
  ERROR_ROUTE
])

router.beforeEnter(({ path, query }) => {
  const code = router.getPermission(path)

  if (code === 401) {
    router.jumpLogin(path, query)
  }

  return code === 200
})

export default router
