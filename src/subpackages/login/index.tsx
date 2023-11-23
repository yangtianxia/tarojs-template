import { defineComponent } from 'vue'
import { useNavigationBar } from '@/hooks'

import less from './index.module.less'

const [name] = BEM('login', less)

export default defineComponent({
  name,

  setup() {
    useNavigationBar({
      showHomeIcon: false
    })

    return () => (
      <gm-app loading={false}>
        <gm-body></gm-body>
      </gm-app>
    )
  }
})
