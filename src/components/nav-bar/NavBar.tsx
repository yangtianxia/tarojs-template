// Types
import type { NavBarPosition, NavBarTitleStyle } from './types'

// Vue
import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  type PropType,
  type ComputedRef,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

// Tarojs
import { usePageScroll } from '@tarojs/taro'

// Common
import debounce from 'debounce'
import { shallowMerge, callInterceptor, type Interceptor } from '@txjs/shared'
import _router from '@/router'
import { useAppStore } from '@/store'
import { useCurrentPage } from '@/hooks/current-page'
import { useSystemInfo } from '@/hooks/system-info'
import { NAV_BAR_CONTEXT_KEY } from '@/hooks/nav-bar-context'
import { useExpose } from '@/hooks/expose'
import { useParent } from '@/hooks/relation/parent'

// Components
import Icon from '../icon'
import SafeArea from '../safe-area'
import { onAppLoaded } from '../app/AppContext'

// Component utils
import { VNodeProp, truthProp, makeNumericProp, makeStringProp } from '../_utils/props'
import { createVNode } from '../_utils/basic'
import { addUnit, getZIndexStyle } from '../_utils/style'

const [name, bem] = BEM('nav-bar')

const titleStyle = ['black', 'white'] as const

const navBarProps = {
  border: Boolean,
  title: VNodeProp,
  titleClass: String,
  leftClass: String,
  fixed: truthProp,
  background: String,
  placeholder: truthProp,
  showHomeIcon: truthProp,
  scrollAnimation: Boolean,
  titleAnimation: Boolean,
  safeAreaInsetTop: truthProp,
  leftArrowNoPaddingLeft: Boolean,
  zIndex: makeNumericProp(971),
  position: makeStringProp<NavBarPosition>('center'),
  proloadTitleStyle: makeStringProp<NavBarTitleStyle>('black'),
  titleStyle: makeStringProp<NavBarTitleStyle>('black'),
  backBefore: Function as PropType<Interceptor>
}

export type NavBarProps = ExtractPropTypes<typeof navBarProps>

export type NavBarConfig = Partial<NavBarProps>

export type NavBarProvide = {
  readonly height: ComputedRef<number>
  setConfig(config: NavBarConfig): void
}

export default defineComponent({
  name,

  props: navBarProps,

  setup(originProps, { slots, attrs }) {
    const appStore = useAppStore()
    const currentPage = useCurrentPage()
    const { statusBarHeight = 0 } = useSystemInfo()

    const minHeight = 44
    const minHeightUnit = addUnit(minHeight)
    const hasTabbar = _router.checkTabbar(currentPage.router.path)
    const hasAccessRecord = _router.getPages().length > 1

    // props 失去响应式
    const props = reactive({ ...originProps })

    const opacity = ref(
      props.scrollAnimation ? 0 : 1
    )
    const titleOriginStyle = computed(() => {
      let foundAt = titleStyle.indexOf(props.titleStyle)
      if (appStore.theme === 'dark') {
        foundAt = foundAt ? 1 : 0
      }
      return titleStyle[foundAt]
    })
    const titleColor = ref<string>(
      titleOriginStyle.value
    )
    const height = computed(() =>
      appStore.isEmbedded ? minHeight : (statusBarHeight + minHeight)
    )
    const leftArrowVisible = computed(() =>
      !hasTabbar && (hasAccessRecord || props.showHomeIcon)
    )
    const showLeftAction = computed(() =>
      !!slots.left || leftArrowVisible.value
    )
    const leftStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.leftArrowNoPaddingLeft) {
        style.paddingLeft = addUnit(0)
      }
      return style
    })

    const lazyOpacity = debounce((scrollTop: number) => {
      const visibility = parseFloat(
        (scrollTop / height.value).toFixed(2)
      )

      opacity.value = Math.min(visibility, 1)
      titleColor.value = props.titleAnimation && (opacity.value > 0.1)
        ? `rgba(var(--color-${titleOriginStyle.value})-base, ${opacity.value})`
        : titleOriginStyle.value
    }, 16, true)

    const goBack = () => {
      callInterceptor(props.backBefore, {
        done: () => _router.navigateBack()
      })
    }

    const setConfig = (partial: NavBarConfig) => {
      shallowMerge(props, partial)
    }

    // 监听原 props 变化
    watch(
      () => originProps,
      setConfig
    )

    watch(
      () => titleOriginStyle.value,
      (value) => {
        titleColor.value = value
      }
    )

    useParent(NAV_BAR_CONTEXT_KEY)

    useExpose({ height, setConfig })

    onAppLoaded((value) => {
      titleColor.value = value ? props.proloadTitleStyle : titleOriginStyle.value
    })

    usePageScroll(({ scrollTop }) => {
      if (props.scrollAnimation) {
        lazyOpacity(scrollTop)
      }
    })

    const renderLeft = () => {
      if (process.env.TARO_ENV !== 'alipay' && showLeftAction.value) {
        return (
          <view
            class={[bem('left'), props.leftClass]}
            style={leftStyle.value}
          >
            {slots.left?.() || leftArrowVisible.value ? (
              <Icon
                size={24}
                name={hasAccessRecord ? 'arrow-left' : 'wap-home-o'}
                class={bem('left-icon')}
                color={titleColor.value}
                onTap={goBack}
              />
            ) : null}
          </view>
        )
      }
    }

    const renderTitle = () => {
      const title = createVNode(
        slots.default ||
        (props.title ?? currentPage.currentRoute.value?.title)
      )

      if (title) {
        const noLeft = !showLeftAction.value && !props.leftArrowNoPaddingLeft
        return (
          <view
            class={[
              bem('title', { 'no-left': noLeft }),
              props.titleClass
            ]}
            style={{ color: titleColor.value }}
          >
            {title}
          </view>
        )
      }
    }

    const renderPlaceholder = () => {
      if (props.fixed && props.placeholder) {
        return (
          <view style={{ height: addUnit(height.value) }} />
        )
      }
    }

    const renderNavBar = () => (
      <view
        {...attrs}
        catchMove
        class={bem({
          fixed: props.fixed,
          border: props.border,
          [props.position]: true
        })}
        style={getZIndexStyle(props.zIndex)}
      >
        <SafeArea
          show={props.safeAreaInsetTop}
          position="top"
        />
        <view
          class={bem('curtain')}
          style={{
            opacity: opacity.value,
            background: props.background
          }}
        />
        <view
          class={bem('wrapper')}
          style={{
            height: minHeightUnit,
            lineHeight: minHeightUnit
          }}
        >
          {renderLeft()}
          {renderTitle()}
        </view>
      </view>
    )

    return () => (
      <view>
        {renderPlaceholder()}
        {renderNavBar()}
      </view>
    )
  }
})
