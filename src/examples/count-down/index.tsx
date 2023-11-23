import { App } from '@/components/app'
import { CountDown } from '@/components/count-down'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default'
})

const [name] = Bem('count-down', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <CountDown time={24 * 60 * 60 * 1000} />
          <CountDown time={24 * 60 * 60 * 1000} millisecond />
        </App.Body>
      </App>
    )
  }
})
