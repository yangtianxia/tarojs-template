// Vue
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

// Common
import { notNil } from '@txjs/bool'
import { noop, shallowMerge } from '@txjs/shared'
import { useCurrentPage } from '@/hooks/current-page'
import { useParent } from '@/hooks/relation'
import { APP_CONTEXT_KEY } from '@/hooks/app-context'
import { useHideHomeButton } from '@/hooks/hide-home-button'

// Component
import NavBar from '../nav-bar'
import Loading from '../loading'
import SafeArea from '../safe-area'
import { resultSharedProps, type ResultStatus } from '../result'

// Component utils
import { truthProp } from '../_utils/props'
import { createInjectionKey } from '../_utils/basic'
import { APP_LOADING_KEY } from './AppContext'

const [name, bem] = BEM('app')

const appProps = shallowMerge({}, resultSharedProps, {
  loading: truthProp
})

export type AppProps = ExtractPropTypes<typeof appProps>

export type AppProvide = {
  readonly loading: ComputedRef<boolean>
  readonly status: ComputedRef<ResultStatus>
}

export const APP_KEY = createInjectionKey<AppProvide>(name)

export default defineComponent({
  name,

  props: appProps,

  setup(props, { slots }) {
    const currentPage = useCurrentPage()
    const { parent: appContext } = useParent(APP_CONTEXT_KEY)
    const hasTabbar = router.checkTabbar(currentPage.router.path)

    const navBarRef = ref<any>()
    const loading = computed(() =>
      appContext?.state.loading ?? props.loading
    )
    const status = computed(() =>
      appContext?.state.status ?? props.status
    )
    const navigationStyle = computed(() =>
      currentPage.page?.config?.navigationStyle || currentPage.app.config?.window?.navigationStyle
    )
    const navBarStyle = computed(() => {
      const style = {} as CSSProperties
      if (navBarRef.value) {
        style.paddingTop = `${navBarRef.value.height.value}px`
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
          class={bem('loading')}
          onTouchmove={noop}
        >
          <view
            class={bem('loading-inner', { custom: !!slots.loading })}
            style={navBarStyle.value}
          >
            {slots.loading?.() || <Loading size={26} />}
          </view>
        </view>
      </Transition>
    )

    const renderNavBar = () => {
      if (navigationStyle.value === 'custom') {
        return (
          <NavBar ref={navBarRef} />
        )
      }
    }

    const renderBottom = () => {
      if (notNil(status.value)) return

      if (hasTabbar) {
        return (
          <view class={bem('bottom')} />
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
        {renderNavBar()}
        {slots.default?.()}
        {renderBottom()}
      </view>
    )
  }
})
