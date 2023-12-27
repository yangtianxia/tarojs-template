// Vue
import { defineComponent } from 'vue'

// Common
import { useAppContext } from '@/hooks/app-context'

// Component
import { App } from '@/components/app'

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
      </App>
    )
  }
})
