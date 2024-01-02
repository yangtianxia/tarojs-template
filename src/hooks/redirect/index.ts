import { reactive } from 'vue'
import { useRouter } from '@tarojs/taro'
import { isValidString } from '@txjs/bool'
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

  const redirectTo = (callback?: UnknownCallback) => {
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
