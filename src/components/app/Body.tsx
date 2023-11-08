import { APP_KEY } from './App'
import { Result } from '../result'

import BEM from '@/shared/bem'
import { defineComponent, inject, type ExtractPropTypes } from 'vue'
import { isNil, notNil } from '@txjs/bool'

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

    if (isNil(parent)) return

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
