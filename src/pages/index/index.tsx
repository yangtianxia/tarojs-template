import { defineComponent } from 'vue'

import less from './index.module.less'

const [name] = BEM('index', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <view>{name}</view>
    )
  }
})
