// Vue
import { defineComponent } from 'vue'

// Common
import { useAppContext } from '@/hooks/app-context'

// Component
import { App } from '@/components/app'
import { Button } from '@/components/button'

// Style
import less from './index.module.less'

const [name] = BEM('index', less)

export default defineComponent({
  name,

  setup() {
    const appContext = useAppContext()

    appContext.loading = false

    return () => (
      <App>
        <Button>按钮</Button>
        <Button type="primary">按钮</Button>
        <Button block type="primary">按钮</Button>
        <Button>按钮</Button>
        <Button loading type="primary">按钮</Button>
        <Button size="large" type="primary">按钮</Button>
      </App>
    )
  }
})
