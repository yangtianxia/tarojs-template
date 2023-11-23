import { defineComponent } from 'vue'
import { useRouter } from '@/hooks'

import less from './index.module.less'

const [name] = BEM('error', less)

export default defineComponent({
  name,

  setup() {
    const router = useRouter()
    return () => (
      <gm-app
        loading={false}
        status={{
          status: '404',
          title: '页面不存在或已删除',
          bottom: () => (
            <gm-button onTap={() => router.navigateBack()}>返回上一页</gm-button>
          )
        }}
      >
        <gm-body />
      </gm-app>
    )
  }
})
