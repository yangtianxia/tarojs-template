import { ScrollView, type ITouchEvent } from '@tarojs/components'
import { TAB_ITEM_NAME_KEY } from './Item'

import {
  defineComponent,
  reactive,
  computed,
  watch,
  Fragment,
  type ComputedRef,
  type VNode,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
  type InjectionKey
} from 'vue'

import BEM from '@/shared/bem'
import extend from 'extend'
import { isNil, isArray } from '@txjs/bool'
import { callInterceptor, type Interceptor } from '@txjs/shared'
import { useNextTick, useRect, useRectAll } from '@/hooks'

import { useId } from '../composables/id'
import { useChildren } from '../composables/children'
import { truthProp, makeNumberProp, makeNumericProp } from '../utils'

const [name, bem] = BEM('tab')

const tabProps = {
  border: Boolean,
  ellipsis: truthProp,
  indicator: truthProp,
  value: makeNumericProp(0),
  swipeThreshold: makeNumberProp(4),
  duration: makeNumericProp(300),
  beforeChange: Function as PropType<Interceptor>,
  lineStyle: Object as PropType<CSSProperties>,
  'onUpdate:value': Function as PropType<(value: Numeric) => void>,
  onClickTab: Function as PropType<(options: {
    name: Numeric,
    title?: string
    disabled: boolean
    event: ITouchEvent
  }) => void>,
  onChange: Function as PropType<(options: {
    name: Numeric,
    title?: string
  }) => void>
}

export type TabProps = ExtractPropTypes<typeof tabProps>

export type TabsProvide = {
  id: string
  props: TabProps
  scrollable: ComputedRef<boolean>
  update(name: Numeric): void
}

export const TAB_KEY: InjectionKey<TabsProvide> = Symbol(name)

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

  return nodes.filter((child) => (child.type as any).unique_name === TAB_ITEM_NAME_KEY)
}

export default defineComponent({
  name,

  props: tabProps,

  setup(props, { slots, emit }) {
    const id = useId()
    const { children, linkChildren } = useChildren(TAB_KEY)

    const state = reactive({
      ready: false,
      index: -1,
      offsetLeft: 0,
      lineStyle: {} as CSSProperties
    })

    const duration = computed(() =>
      state.ready ? props.duration : 0
    )

    const scrollable = computed(() =>
      children.length > props.swipeThreshold || !props.ellipsis
    )

    const indicator = computed(() =>
      props.indicator && state.index !== -1
    )

    const clickTab = async (name: Numeric) => {
      const index = children.findIndex((child) => child.identifies.value === name)

      if (index !== -1) {
        const tabItem = children[index]
        const [root, childRect] = await Promise.all([
          useRect(`#${id}`),
          useRectAll(`.${tabItem.id.value}`)
        ])

        if (isNil(root) || !childRect.length) return

        const lineStyle = {} as CSSProperties
        const rect = childRect[index]
        const scopeRect = childRect.slice(0, index)
        const rectLeft = scopeRect.reduce(
          (ret, curr, i) => {
            if (!scrollable.value) {
              const offsetLeft = curr.left + curr.width
              const nextRect = i === index - 1 ? rect : scopeRect[i + 1]
              ret += nextRect.left - offsetLeft
            }
            ret += Math.abs(curr.width)
            return ret
          }, 0
        )

        if (props.indicator) {
          lineStyle.transitionDuration = `${duration.value}ms`
          lineStyle.transform = `translateX(${rectLeft + (rect.width / 2) + (scrollable.value ? 8 : 0)}px) translateX(-50%)`
        }

        state.index = index
        state.offsetLeft = rectLeft - ((root.width - rect.width) / 2)
        state.lineStyle = lineStyle

        return tabItem
      }
    }

    const update = (name: Numeric) => {
      if (isNil(name) || props.value === name) return

      callInterceptor(props.beforeChange, {
        args: [name],
        done: () => {
          emit('update:value', name)
        }
      })
    }

    watch(
      () => props.value,
      (value) => {
        useNextTick(async () => {
          const curr = await clickTab(value)
          if (curr) {
            props.onChange?.({
              name: curr.identifies.value,
              title: curr.title
            })
          }
        })
      }
    )

    watch(
      () => children.length,
      () => {
        if (!state.ready) {
          useNextTick(() => {
            clickTab(props.value)
            state.ready = true
          })
        }
      }
    )

    linkChildren({ props, id, scrollable, update })

    const renderIndicator = () => {
      if (indicator.value && state.ready) {
        return (
          <view
            class={bem('line')}
            style={extend(props.lineStyle, state.lineStyle)}
          />
        )
      }
    }

    const renderWrapper = () => (
      <view
        id={id}
        class={bem('wrapper')}
      >
        {filterChildren(slots.default?.())}
        {renderIndicator()}
      </view>
    )

    return () => (
      <view
        class={[
          bem({ scrollable: scrollable.value }),
          { 'hairline--bottom': props.border }
        ]}
      >
        {scrollable.value ? (
          <ScrollView
            enhanced
            scrollWithAnimation
            scrollX={scrollable.value}
            scrollY={false}
            showScrollbar={false}
            scrollLeft={state.offsetLeft}
            scrollAnimationDuration={`${duration.value}ms`}
            style={{ height: '100%' }}
          >
            {renderWrapper()}
          </ScrollView>
        ): renderWrapper()}
      </view>
    )
  }
})
