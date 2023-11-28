import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  type Ref,
  type PropType,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'
import debounce from 'debounce'
import { usePageScroll } from '@tarojs/taro'
import { shallowMerge, callInterceptor, type Interceptor } from '@txjs/shared'
import { useThemeStore } from '@/store'
import {
  USE_NAVIGATION_BAR,
  useRoute,
  useRouter,
  useSystemInfo
} from '@/hooks'

import { Icon } from '../icon'
import { useExpose } from '../composables/expose'
import { useParent } from '../composables/parent'
import {
  vnodeProp,
  truthProp,
  makeNumericProp,
  makeStringProp,
  genVNode,
  getZIndexStyle,
  addUnit,
  onAppLoaded
} from '../utils'
import type { NavigationBarPosition, NavigationBarTitleStyle } from './types'

const [name, bem] = BEM('navigation-bar')

const titleStyle = ['black', 'white']

const navigationBarProps = {
  border: Boolean,
  title: vnodeProp,
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
  position: makeStringProp<NavigationBarPosition>('center'),
  proloadTitleStyle: makeStringProp<NavigationBarTitleStyle>('black'),
  titleStyle: makeStringProp<NavigationBarTitleStyle>('black'),
  backBefore: Function as PropType<Interceptor>
}

export type NavigationBarProps = ExtractPropTypes<typeof navigationBarProps>

export type NavigationBarConfig = Partial<NavigationBarProps>

export type NavigationBarProvide = {
  readonly height: Ref<number>
  setConfig(config: NavigationBarConfig): void
}

export default defineComponent({
  name,

  inheritAttrs: false,

  props: navigationBarProps,

  setup(originProps, { slots, attrs }) {
    const themeStore = useThemeStore()
    const router = useRouter()
    const { path, currentRoute } = useRoute()
    const { statusBarHeight = 0 } = useSystemInfo()

    const BASE_HEIGHT = 44
    const hasTabbar = router.checkTabbar(path)
    const hasAccessRecord = router.getCurrentPages().length > 1

    // props失去响应式
    const props = reactive({ ...originProps })

    const titleOriginColor = computed(() => {
      let foundAt = titleStyle.indexOf(props.titleStyle)
      if (themeStore.theme === 'dark') {
        foundAt = foundAt === 0 ? foundAt + 1 : foundAt - 1
      }
      return titleStyle[foundAt]
    })

    const height = ref(
      statusBarHeight + BASE_HEIGHT
    )
    const opacity = ref(
      props.scrollAnimation ? 0 : 1
    )
    const titleColor = ref(
      titleOriginColor.value
    )

    const leftArrowVisible = computed(() =>
      !hasTabbar && (hasAccessRecord || props.showHomeIcon)
    )
    const showLeftAction = computed(() =>
      !!slots.left || leftArrowVisible.value
    )
    const navigationBarStyle = computed(() => {
      const style = {
        ...getZIndexStyle(props.zIndex),
        height: addUnit(BASE_HEIGHT),
        lineHeight: addUnit(BASE_HEIGHT)
      } as CSSProperties
      if (props.safeAreaInsetTop) {
        style.paddingTop = addUnit(statusBarHeight)
      }
      return style
    })
    const leftStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.leftArrowNoPaddingLeft) {
        style.paddingLeft = addUnit(0)
      }
      return style
    })

    const lazySetOpacity = debounce(
      (scrollTop: number) => {
        const visibility = parseFloat(
          (scrollTop / height.value).toFixed(2)
        )
        opacity.value =
          visibility > 1
            ? 1
            : visibility
        titleColor.value =
          props.titleAnimation && (opacity.value > 0.1)
            ? `rgba(var(--color-${titleOriginColor.value})-base, ${opacity.value})`
            : titleOriginColor.value
      }, 16, true
    )

    const goBack = () => {
      callInterceptor(props.backBefore, {
        done: () => router.navigateBack()
      })
    }

    const setConfig = (partial: NavigationBarConfig) => {
      shallowMerge(props, partial)
    }

    watch(
      () => originProps,
      (value) => setConfig(value)
    )

    watch(
      () => titleOriginColor.value,
      (value) => {
        titleColor.value = value
      }
    )

    useParent(USE_NAVIGATION_BAR)

    useExpose({ height, setConfig })

    onAppLoaded((value) => {
      titleColor.value = value ? props.proloadTitleStyle : titleOriginColor.value
    })

    usePageScroll(({ scrollTop }) => {
      if (props.scrollAnimation) {
        lazySetOpacity(scrollTop)
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
                size={20}
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
      const title = genVNode(slots.default || (props.title ?? currentRoute.value?.title))
      if (title) {
        return (
          <view
            class={[
              bem('title', { 'no-left': !showLeftAction.value && !props.leftArrowNoPaddingLeft }),
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

    const renderNavbar = () => (
      <view
        catchMove
        {...attrs}
        style={navigationBarStyle.value}
        class={bem({
          fixed: props.fixed,
          border: props.border,
          [props.position]: true
        })}
      >
        <view
          class={bem('curtain')}
          style={{
            opacity: opacity.value,
            background: props.background
          }}
        />
        <view class={bem('wrapper')}>
          {renderLeft()}
          {renderTitle()}
        </view>
      </view>
    )

    return () => (
      <view>
        {renderPlaceholder()}
        {renderNavbar()}
      </view>
    )
  }
})
