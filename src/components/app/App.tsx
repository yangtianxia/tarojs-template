import {
  defineComponent,
  computed,
  provide,
  Transition,
  type ComputedRef,
  type ExtractPropTypes
} from 'vue'
import { noop, shallowMerge } from '@txjs/shared'
import { notNil } from '@txjs/bool'
import { USE_APP_KEY, useRoute, useRouter, useHideHomeButton } from '@/hooks'

import { resultSharedProps, type ResultStatusType } from '../result'
import { NavigationBar } from '../navigation-bar'
import { Loading } from '../loading'
import { SafeArea } from '../safe-area'
import { useParent } from '../composables/parent'
import { truthProp, createInjectionKey } from '../utils'

const [name, bem] = BEM('app')

const appProps = shallowMerge({}, resultSharedProps, {
  loading: truthProp
})

export type AppProps = ExtractPropTypes<typeof appProps>

export type AppProvide = {
  readonly loading: ComputedRef<boolean>
  readonly status: ComputedRef<ResultStatusType>
}

export const APP_KEY = createInjectionKey<AppProvide>(name)

export default defineComponent({
  name,

  props: appProps,

  setup(props, { slots }) {
    const router = useRouter()
    const { path, pageInstance } = useRoute()
    const { parent } = useParent(USE_APP_KEY)

    const hasTabbar = router.checkTabbar(path)
    const loading = computed(() =>
      parent?.state.loading ?? props.loading
    )
    const status = computed(() =>
      parent?.state.status ?? props.status
    )
    const navigationStyle = computed(() =>
      pageInstance?.page?.config?.navigationStyle || pageInstance?.app?.config?.window?.navigationStyle
    )

    // 支付宝默认隐藏首页图标按钮
    if (process.env.TARO_ENV === 'alipay') {
      useHideHomeButton()
    }

    provide(APP_KEY, { loading, status })

    const renderLoading = () => (
      <Transition name="fade">
        <view
          v-show={loading.value}
          catchMove
          disableScroll
          class={bem('overlay')}
          onTouchmove={noop}
        >
          <view class={bem('overlay-wrapper')}>
            <Loading size={26} />
          </view>
        </view>
      </Transition>
    )

    const renderNavigationBar = () => {
      if (navigationStyle.value === 'custom') {
        return (
          <NavigationBar />
        )
      }
    }

    const renderBottom = () => {
      if (notNil(status.value)) return

      const nodeChild = (
        <view class={bem('bottom')} />
      )

      if (hasTabbar) {
        return nodeChild
      }

      return (
        <SafeArea>{nodeChild}</SafeArea>
      )
    }

    return () => (
      <view class={bem()}>
        {renderLoading()}
        {renderNavigationBar()}
        {slots.default?.()}
        {renderBottom()}
      </view>
    )
  }
})
