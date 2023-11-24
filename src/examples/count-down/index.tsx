import { defineComponent } from 'vue'

import { CountDown } from '@/components/count-down'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name] = BEM('count-down', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <CountDown time={24 * 60 * 60 * 1000} />
          <CountDown time={24 * 60 * 60 * 1000} millisecond />
        </gm-body>
      </gm-app>
    )
  }
})
