import {
  defineComponent,
  ref,
  computed,
  provide,
  Transition,
  type ComputedRef,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'
import { getCurrentInstance } from '@tarojs/taro'
import { noop, shallowMerge } from '@txjs/shared'
import { notNil } from '@txjs/bool'
import { useTabbarStore } from '@/store'
import { USE_PAGE_KEY, useRouter, useHideHomeButton } from '@/hooks'

import { resultSharedProps, type ResultStatusType } from '../result'
import { NavigationBar, type NavigationBarInstance } from '../navigation-bar'
import { Loading } from '../loading'
import { SafeArea } from '../safe-area'
import { useParent } from '../composables/parent'
import { truthProp, createInjectionKey } from '../utils'
import { APP_LOADING_KEY } from './utils'

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
    const tabbarStore = useTabbarStore()
    const context = getCurrentInstance()
    const router = useRouter()
    const { parent } = useParent(USE_PAGE_KEY)
    const hasTabbar = router.checkTabbar(context.router?.path)

    const navigationBarRef = ref<NavigationBarInstance>()
    const loading = computed(() =>
      parent?.state.loading ?? props.loading
    )
    const status = computed(() =>
      parent?.state.status ?? props.status
    )
    const navigationStyle = computed(() =>
      context.page?.config?.navigationStyle || context?.app?.config?.window?.navigationStyle
    )
    const navigationBarStyle = computed(() => {
      const style = {} as CSSProperties
      if (navigationBarRef.value) {
        style.paddingTop = `${navigationBarRef.value.height.value}px`
      }
      if (hasTabbar) {
        style.paddingBottom = `${tabbarStore.height}px`
      }
      return style
    })

    // 支付宝默认隐藏首页图标按钮
    if (process.env.TARO_ENV === 'alipay') {
      useHideHomeButton()
    }

    provide(APP_LOADING_KEY, () => loading.value)

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
          <view
            class={bem('overlay-wrapper', { skeleton: slots.loading })}
            style={navigationBarStyle.value}
          >
            {slots.loading?.() || (
              <Loading size={26} />
            )}
          </view>
        </view>
      </Transition>
    )

    const renderNavigationBar = () => {
      if (navigationStyle.value === 'custom') {
        return (
          <NavigationBar ref={navigationBarRef} />
        )
      }
    }

    const renderBottom = () => {
      if (notNil(status.value)) return

      if (hasTabbar) {
        return (
          <view
            class={bem('bottom')}
            style={{ paddingBottom: `${tabbarStore.height}px` }}
          />
        )
      }

      return (
        <SafeArea>
          <view class={bem('bottom')} />
        </SafeArea>
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
