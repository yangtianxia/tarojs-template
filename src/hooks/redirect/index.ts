import { reactive } from 'vue'
import { useRouter } from '@tarojs/taro'
import { isValidString } from '@txjs/bool'
import _router from '@/router'
import { REDIRECT_URI, REDIRECT_PARAMS } from '@/shared/constants'

export const useRedirect = () => {
  const { params } = useRouter()

  let redirect_uri = params[REDIRECT_URI]

  if (isValidString(redirect_uri)) {
    redirect_uri = decodeURIComponent(redirect_uri)
  }

  const from = reactive({
    [REDIRECT_PARAMS]: redirect_uri
  })

  const redirectTo = (callback?: AnyCallback) => {
    const redirectURL = from[REDIRECT_PARAMS]

    if (redirectURL) {
      if (callback) {
        callback(redirectURL)
      } else {
        _router[_router.checkTabbar(redirectURL) ? 'reLaunch' : 'redirectTo'](redirectURL)
      }
    } else {
      _router.navigateBack()
    }
  }

  return { from, params, redirectTo }
}
