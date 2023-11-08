import { reactive } from 'vue'
import { isValidString } from '@txjs/bool'

import { useRoute } from '../route'
import { useRouter } from '../router'

export const REDIRECT_URI = 'redirect_uri'
export const REDIRECT_PARAMS = 'redirect_params'

export const useLogin = () => {
  const router = useRouter()
  const { params } = useRoute()

  let redirect_uri = params[REDIRECT_URI]

  if (isValidString(redirect_uri)) {
    redirect_uri = decodeURIComponent(redirect_uri)
  }

  const from = reactive({
    [REDIRECT_PARAMS]: redirect_uri
  })

  const redirectTo = (callback?: Callback) => {
    const redirectURL = from[REDIRECT_PARAMS]

    if (redirectURL) {
      if (callback) {
        callback(redirectURL)
      } else {
        router[router.checkTabbar(redirectURL) ? 'reLaunch' : 'redirectTo'](redirectURL)
      }
    } else {
      router.navigateBack()
    }
  }

  return { from, params, redirectTo }
}
