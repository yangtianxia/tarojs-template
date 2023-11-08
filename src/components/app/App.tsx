import { NavigationBar } from '../navigation-bar'
import { Loading } from '../loading'
import { SafeArea } from '../safe-area'
import { resultSharedProps, type ResultStatusType } from '../result'

import {
  defineComponent,
  computed,
  provide,
  Transition,
  type ComputedRef,
  type ExtractPropTypes,
  type InjectionKey
} from 'vue'

import BEM from '@/shared/bem'
import { noop, shallowMerge } from '@txjs/shared'
import { notNil } from '@txjs/bool'
import { USE_APP_KEY, useRoute, useRouter } from '@/hooks'

import { useParent } from '../composables/parent'
import { truthProp, makeStringProp } from '../utils'

type NavigationStyle = 'custom' | 'default'

const [name, bem] = BEM('app')

const appProps = shallowMerge({}, resultSharedProps, {
  navigationStyle: makeStringProp<NavigationStyle>('default'),
  loading: truthProp
})

export type AppProps = ExtractPropTypes<typeof appProps>

export type AppProvide = {
  readonly loading: ComputedRef<boolean>
  readonly status: ComputedRef<ResultStatusType>
}

export const APP_KEY: InjectionKey<AppProvide> = Symbol(name)

export default defineComponent({
  name,

  props: appProps,

  setup(props, { slots }) {
    const router = useRouter()
    const { path } = useRoute()
    const { parent } = useParent(USE_APP_KEY)

    const hasTabbar = router.checkTabbar(path)
    const loading = computed(() =>
      parent?.state.loading ?? props.loading
    )
    const status = computed(() =>
      parent?.state.status ?? props.status
    )

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
      if (props.navigationStyle === 'default') {
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
