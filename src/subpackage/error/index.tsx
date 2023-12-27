// Vue
import { defineComponent } from 'vue'

// Component
import { App } from '@/components/app'

// Style
import less from './index.module.less'

const [name] = BEM('error', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App
        loading={false}
        status={{
          status: '404',
          title: '页面不存在或已删除',
        }}
      />
    )
  }
})
