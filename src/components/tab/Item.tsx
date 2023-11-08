import type { ITouchEvent } from '@tarojs/components'
import { TAB_KEY } from './Tab'

import BEM from '@/shared/bem'
import { defineComponent, computed, type ComputedRef, type ExtractPropTypes } from 'vue'
import { isNil } from '@txjs/bool'

import { useExpose } from '../composables/expose'
import { useParent } from '../composables/parent'

const [name, bem] = BEM('tab-item')

const tabItemProps = {
  title: String,
  disabled: Boolean,
  name: [Number, String]
}

export type TabItemProps = ExtractPropTypes<typeof tabItemProps>

export type TabItemExpose = {
  id: ComputedRef<string>
}

export const TAB_ITEM_NAME_KEY = Symbol(name)

export default defineComponent({
  unique_name: TAB_ITEM_NAME_KEY,

  name,

  props: tabItemProps,

  setup(props, { slots }) {
    const { parent, index } = useParent(TAB_KEY)

    if (isNil(parent)) return

    const id = computed(() =>
      `${parent.id}-${name}`
    )
    const identifies = computed(() =>
      props.name || index.value
    )
    const current = computed(() =>
      identifies.value === parent.props.value
    )

    const onTabClick = (event: ITouchEvent) => {
      parent.props.onClickTab?.({
        event,
        name: identifies.value,
        title: props.title,
        disabled: props.disabled
      })

      if (!props.disabled) {
        parent.update(identifies.value)
      }
    }

    useExpose({ id, identifies })

    return () => (
      <view
        class={[
          id.value,
          bem({
            active: current.value,
            disabled: props.disabled
          })
        ]}
        onTap={onTabClick}
      >
        <view
          class={[
            bem('text'),
            { ellipsis: parent.scrollable.value }
          ]}
        >
          {slots.default?.({
            name: identifies.value,
            active: current.value
          }) || props.title}
        </view>
      </view>
    )
  }
})
