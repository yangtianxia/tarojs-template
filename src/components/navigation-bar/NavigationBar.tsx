import { Icon } from '../icon'

import {
  defineComponent,
  ref,
  reactive,
  computed,
  watch,
  mergeProps,
  type Ref,
  type PropType,
  type ExtractPropTypes,
  type CSSProperties
} from 'vue'

import {
  USE_NAVIGATION_BAR,
  useRoute,
  useRouter,
  useSystemInfo,
  useRect,
  useNextTick
} from '@/hooks'

import BEM from '@/shared/bem'
import debounce from 'debounce'
import extend from 'extend'
import { useReady, usePageScroll } from '@tarojs/taro'
import { callInterceptor, type Interceptor } from '@txjs/shared'
import { useThemeStore } from '@/store'

import { useId } from '../composables/id'
import { useExpose } from '../composables/expose'
import { useParent } from '../composables/parent'
import type { NavigationBarPosition, NavigationBarTitleStyle } from './types'

import {
  truthProp,
  makeNumericProp,
  makeStringProp,
  getZIndexStyle,
  addUnit,
  onAppLoaded
} from '../utils'

const [name, bem] = BEM('navigation-bar')

const titleStyle = ['black', 'white']

const navigationBarProps = {
  border: Boolean,
  title: String,
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
    const id = useId()
    const themeStore = useThemeStore()
    const router = useRouter()
    const { path, currentRoute } = useRoute()
    const { statusBarHeight = 0 } = useSystemInfo()

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

    const height = ref(0)
    const opacity = ref(
      props.scrollAnimation ? 0 : 1
    )
    const titleColor = ref(
      titleOriginColor.value
    )
    const leftArrowVisible = ref(
      !hasTabbar && (hasAccessRecord || props.showHomeIcon)
    )

    const titleText = computed(() =>
      props.title ?? currentRoute.value?.title
    )
    const showLeftAction = computed(() =>
      !!slots.left || leftArrowVisible.value
    )
    const navigationBarStyle = computed(() => {
      const style = getZIndexStyle(props.zIndex)
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

    const getRootHeight = () => {
      useNextTick(async () => {
        const rect = await useRect(`#${id}`)

        if (rect) {
          height.value = rect.height
        }
      })
    }

    const lazySetOpacity = debounce(
      (scrollTop: number) => {
        const visibility = parseFloat(
          (scrollTop / height.value).toFixed(2)
        )
        opacity.value = visibility > 1 ? 1 : visibility
        titleColor.value = props.titleAnimation && (opacity.value > 0.1)
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
      extend(props, partial)
    }

    watch(
      () => originProps,
      setConfig,
      { deep: true }
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

    useReady(getRootHeight)

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
      if (slots.default || titleText.value) {
        return (
          <view
            class={[
              bem('title', { 'no-left': !showLeftAction.value && !props.leftArrowNoPaddingLeft }),
              props.titleClass
            ]}
            style={{ color: titleColor.value }}
          >
            {slots.default?.() || titleText.value}
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
        {...mergeProps(attrs, { id })}
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
      <>
        {renderPlaceholder()}
        {renderNavbar()}
      </>
    )
  }
})
