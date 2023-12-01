import { defineComponent, ref, shallowRef } from 'vue'
import { useAreaData } from '@/shared/area-data'

import { Field } from '@/components/form'
import { Cascader } from '@/components/cascader'

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
    const area = shallowRef(
      useAreaData()
    )

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
          <Cascader
            v-model:value={value.value}
            v-model:show={visible.value}
            title="选择地区"
            options={area.value}
            onFinish={({ selectedOptions }) => {
              fieldValue.value = selectedOptions.map((item) => item.text).join('/')
            }}
          />
        </gm-body>
      </gm-app>
    )
  }
})
