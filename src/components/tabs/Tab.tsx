import type { ITouchEvent } from '@tarojs/components'
import { TABS_KEY } from './Tabs'

import BEM from '@/shared/bem'
import { defineComponent, computed, watch, getCurrentInstance, type ExtractPropTypes } from 'vue'
import { isNil } from '@txjs/bool'
import { useRect } from '@/hooks'

import { useId } from '../composables/id'
import { useExpose } from '../composables/expose'
import { useParent } from '../composables/parent'

const [name, bem] = BEM('tab')

const tabProps = {
  title: String,
  disabled: Boolean,
  name: [Number, String]
}

export type TabProps = ExtractPropTypes<typeof tabProps>

export default defineComponent({
  name,

  props: tabProps,

  setup(props, { slots }) {
    const instance = getCurrentInstance()
    const { parent, index } = useParent(TABS_KEY)

    if (isNil(parent)) {
      throw new Error('`Tab` is not a child of `tabs`')
    }

    const id = useId()
    const { width, left, triggerBoundingClientRect } = useRect(`#${id}`, {
      refs: ['width', 'left'],
      triggerCallback: () => parent.link(instance!, true)
    })

    const tabKey = computed(() =>
      props.name ?? index.value
    )
    const isActive = computed(() =>
      tabKey.value === parent.props.value
    )

    const onTabClick = (event: ITouchEvent) => {
      triggerBoundingClientRect()
      parent.props.onClickTab?.({
        event,
        name: tabKey.value,
        title: props.title,
        disabled: props.disabled
      })

      if (!props.disabled) {
        parent.activeTab(tabKey.value)
      }
    }

    watch(
      () => isActive.value,
      (value, oldValue) => {
        if (oldValue && value === false) {
          triggerBoundingClientRect()
        }
      }
    )

    useExpose({ tabKey, width, left })

    return () => (
      <view
        id={id}
        key={tabKey.value}
        onTap={onTabClick}
        class={bem({
          active: isActive.value,
          disabled: props.disabled
        })}
      >
        <view class={bem('content', { ellipsis: parent.canScroll.value })}>
          {slots.default?.({
            name: tabKey.value,
            active: isActive.value
          }) || props.title}
        </view>
      </view>
    )
  }
})
