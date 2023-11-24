import { defineComponent } from 'vue'

import { Result } from '@/components/result'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'result'
})

const [name] = BEM('result', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <Result status="500" />
          <Result status="404" />
          <Result status="error" />
          <Result status="network" />
          <Result status="nodata" />
        </gm-body>
      </gm-app>
    )
  }
})
