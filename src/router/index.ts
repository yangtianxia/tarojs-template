import createRouter from './core'
import { ERROR_ROUTE } from './routes/basic'

const router = new createRouter([
  ERROR_ROUTE
])

router.beforeEnter(({ path, query }) => {
  const code = router.getPermission(path)

  if (code === 401) {

  }

  return code === 200
})

export default router
