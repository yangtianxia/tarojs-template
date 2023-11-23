import { defineComponent, inject, type ExtractPropTypes } from 'vue'
import { isNil, notNil } from '@txjs/bool'

import { APP_KEY } from './App'
import { Result } from '../result'

const [name, bem] = BEM('body')

const bodyProps = {
  shrink: Boolean
}

export type BodyProps = ExtractPropTypes<typeof bodyProps>

export default defineComponent({
  name,

  props: bodyProps,

  setup(props, { slots }) {
    const parent = inject(APP_KEY)

    if (isNil(parent)) {
      throw new Error('Body必须是App的子组件')
    }

    return () => {
      const { shrink } = props
      const { status } = parent
      const empty = notNil(status.value)

      return (
        <view class={bem({ empty, shrink })}>
          {empty ? <Result status={status.value} /> : slots.default?.()}
        </view>
      )
    }
  }
})
