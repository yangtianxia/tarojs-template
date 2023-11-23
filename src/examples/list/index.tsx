import { App } from '@/components/app'
import { List } from '@/components/list'

import Bem from '@txjs/bem'
import { defineComponent, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'list'
})

const [name] = Bem('list', less)

export default defineComponent({
  name,

  setup() {
    const listModel = reactive({
      error: false,
      loading: false,
      finish: false,
      data: []
    })

    const onLoad = () => {
      setTimeout(() => {
        console.log('list')
        listModel.loading = false
        listModel.error = true
      }, 1000)
    }

    return () => (
      <App loading={false}>
        <List
          v-model:loading={listModel.loading}
          v-model:error={listModel.error}
          immediateCheck
          data={listModel.data}
          finished={listModel.finish}
          onLoad={onLoad}
        />
      </App>
    )
  }
})
