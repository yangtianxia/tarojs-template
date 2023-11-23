import { App } from '@/components/app'
import { CellGroup } from '@/components/cell'
import { Field } from '@/components/form'
import { Cascader } from '@/components/cascader'
import { Popup } from '@/components/popup'

import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'
import { useAreaData } from '@/shared/area-data'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'cascader'
})

const [name] = Bem('cascader', less)

export default defineComponent({
  name,

  setup() {
    const visible = ref(false)
    const fieldValue = ref()
    const value = ref('370323')

    return () => (
      <App loading={false}>
        <App.Body shrink>
          <CellGroup
            inset
            title="常规使用"
          >
            <Field
              readonly
              clickable
              inputAlign="right"
              title="选择地区"
              placeholder="请选择地区"
              value={fieldValue.value}
              onTap={() => visible.value = true}
            />
          </CellGroup>
          <Popup
            v-model:show={visible.value}
            round
            closeable
            safeAreaInsetBottom
            position="bottom"
            title="选择地区"
          >
            <Cascader
              v-model:value={value.value}
              options={useAreaData()}
              onFinish={({ selectedOptions }) => {
                fieldValue.value = selectedOptions.map((item) => item.text).join('/')
              }}
            />
          </Popup>
        </App.Body>
      </App>
    )
  }
})
