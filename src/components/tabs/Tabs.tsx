import { ScrollView, type ITouchEvent } from '@tarojs/components'

import {
  defineComponent,
  ref,
  computed,
  watch,
  Fragment,
  type ComputedRef,
  type VNode,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes
} from 'vue'

import BEM from '@/shared/bem'
import { isNil, isArray } from '@txjs/bool'
import { shallowMerge, callInterceptor, type Interceptor } from '@txjs/shared'
import { useRect } from '@/hooks'

import { useId } from '../composables/id'
import { useChildren } from '../composables/children'
import { truthProp, makeNumberProp, makeNumericProp, createInjectionKey, addUnit } from '../utils'

const [name, bem] = BEM('tabs')

const tabsProps = {
  border: Boolean,
  ellipsis: truthProp,
  value: makeNumericProp(0),
  swipeThreshold: makeNumberProp(4),
  duration: makeNumericProp(300),
  showIndicator: truthProp,
  indicatorStyle: Object as PropType<CSSProperties>,
  beforeChange: Function as PropType<Interceptor>,
  onClickTab: Function as PropType<(options: {
    name: Numeric,
    title?: string
    disabled: boolean
    event: ITouchEvent
  }) => void>,
  onChange: Function as PropType<(options: {
    name: Numeric,
    title?: string
  }) => void>,
  'onUpdate:value': Function as PropType<(value: Numeric) => void>
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>

export type TabsProvide = {
  props: TabsProps
  canScroll: ComputedRef<boolean>
  activeTab(name: Numeric): void
}

export const TABS_KEY = createInjectionKey<TabsProvide>(name)

function filterChildren(children: VNode[] = []) {
  const nodes: VNode[] = []

  children.forEach((child) => {
    if (isArray(child)) {
      nodes.push(...(child as any))
    } else if (child.type === Fragment) {
      nodes.push(...child.children as VNode[])
    } else {
      nodes.push(child)
    }
  })

  return nodes
}

export default defineComponent({
  name,

  props: tabsProps,

  setup(props, { slots, emit }) {
    const id = useId()
    const { children, customChildren, linkChildren } = useChildren(TABS_KEY)
    const { width, triggerBoundingClientRect } = useRect(`#${id}`, {
      refs: ['width']
    })

    const initialized = ref(false)
    const currentIndex = ref(-1)
    const scrollLeft = ref(0)
    const indicatorOffsetLeft = ref(0)

    const duration = computed(() =>
      initialized.value ? props.duration : 0
    )
    const showIndicator = computed(() =>
      props.showIndicator && currentIndex.value !== -1
    )
    const canScroll = computed(() =>
      children.length > props.swipeThreshold || !props.ellipsis
    )
    const tabsStyle = computed(() => {
      const style = {} as CSSProperties
      if (showIndicator.value) {
        style['--tabs-indicator-offset-left'] = addUnit(indicatorOffsetLeft.value)
      }
      return style
    })
    const indicatorStyle = computed(() => {
      const style = {} as CSSProperties
      if (props.showIndicator) {
        style.transitionDuration = `${duration.value}ms`
      }
      return style
    })

    const clickTab = (name: Numeric) => {
      const foundAt = children.findIndex((child) => child.tabKey.value === name)

      if (foundAt === -1) return

      const currentTab = children[foundAt]
      const siblings = children.slice(0, foundAt)
      const tabOffsetLeft = siblings.reduce(
        (left, tab, index) => {
          if (!canScroll.value) {
            const offsetLeft = tab.left.value + tab.width.value
            const next = index === foundAt - 1 ? currentTab : siblings[index + 1]
            left += next.left.value - offsetLeft
          }
          left += Math.abs(tab.width.value)
          return left
        }, 0
      )

      indicatorOffsetLeft.value = tabOffsetLeft + (currentTab.width.value * 0.5)
      scrollLeft.value = tabOffsetLeft - ((width.value - currentTab.width.value) * 0.5)
      currentIndex.value = foundAt

      return currentTab
    }

    const activeTab = (name: Numeric) => {
      if (isNil(name) || props.value === name) return

      callInterceptor(props.beforeChange, {
        args: [name],
        done: () => {
          triggerBoundingClientRect()
          emit('update:value', name)
        }
      })
    }

    watch(
      () => props.value,
      (value) => {
        const tab = clickTab(value)
        if (tab) {
          props.onChange?.({
            name: tab.tabKey.value,
            title: tab.title
          })
        }
      }
    )

    watch(
      () => customChildren.length,
      (value, oldValue) => {
        if (value !== oldValue) {
          initialized.value = false
        }

        if (!initialized.value && value === children.length) {
          clickTab(props.value)
          initialized.value = true
        }
      }
    )

    linkChildren({ props, canScroll, activeTab })

    return () => {
      const scrollable = canScroll.value
      const { border } = props

      return (
        <view
          class={bem({ scrollable, border })}
          style={tabsStyle.value}
        >
          <ScrollView
            enhanced
            scrollWithAnimation
            scrollY={false}
            showScrollbar={false}
            scrollX={scrollable}
            scrollLeft={scrollLeft.value}
            scrollAnimationDuration={`${duration.value}ms`}
            class={bem('scroll')}
          >
            <view
              id={id}
              class={bem('content')}
            >
              {filterChildren(slots.default?.())}
              {initialized.value && showIndicator.value ? (
                <view
                  class={bem('indicator')}
                  style={shallowMerge({}, props.indicatorStyle, indicatorStyle.value)}
                />
              ) : null}
            </view>
          </ScrollView>
        </view>
      )
    }
  }
})
