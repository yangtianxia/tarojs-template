import { defineComponent, ref } from 'vue'
import { useAreaData } from '@/shared/area-data'

import { Field } from '@/components/form'
import { Cascader } from '@/components/cascader'
import { Popup } from '@/components/popup'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'cascader'
})

const [name] = BEM('cascader', less)

export default defineComponent({
  name,

  setup() {
    const visible = ref(false)
    const fieldValue = ref()
    const value = ref('370323')

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <gm-cell-group
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
          </gm-cell-group>
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
        </gm-body>
      </gm-app>
    )
  }
})
