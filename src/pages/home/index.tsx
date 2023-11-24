import { defineComponent } from 'vue'

import less from './index.module.less'

const [name] = BEM('home', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body></gm-body>
      </gm-app>
    )
  }
})
