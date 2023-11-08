import BEM from '@/shared/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

const [name] = BEM('login', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app>
        <gm-body></gm-body>
      </gm-app>
    )
  }
})
