import { defineComponent, reactive } from 'vue'
import { validator } from '@txjs/vant-validator'
import { makeStringMap } from '@txjs/make'

import { Form, Field } from '@/components/form'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'form'
})

const [name] = BEM('form', less)

export default defineComponent({
  name,

  setup() {
    const formModel = reactive({
      ...makeStringMap([
        'name',
        'telnumber',
        'password',
        'addr'
      ]),
      eye: true
    })

    const formRules = validator({
      name: {
        label: '姓名',
        required: true,
        rangelength: [4, 12]
      },
      telnumber: {
        label: '电话',
        required: true,
        telephone: true
      },
      addr: {
        label: '地址',
        maxlength: 120
      }
    })

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <Form
            rules={formRules}
            requiredAlign="right"
          >
            <gm-cell-group
              inset
              title="用户信息"
            >
              <Field
                v-model:value={formModel.name}
                required
                name="name"
                title="姓名"
                placeholder="请输入姓名"
              />
              <Field
                v-model:value={formModel.telnumber}
                required
                name="telnumber"
                type="number"
                title="电话"
                placeholder="请输入电话"
                maxlength={11}
              />
              <Field
                v-model:value={formModel.password}
                name="password"
                type="password"
                title="密码"
                placeholder="请输入密码"
                password={formModel.eye}
                rightIcon={formModel.eye ? 'closed-eye' : 'eye-o'}
                onClickRightIcon={() => formModel.eye = !formModel.eye}
              />
              <Field
                v-model:value={formModel.addr}
                name="addr"
                type="textarea"
                title="地址"
                placeholder="请输入地址"
              />
            </gm-cell-group>
            <gm-button
              width={300}
              type="primary"
              formType="submit"
              style={{ marginTop: '32rpx' }}
            >提交</gm-button>
          </Form>
          <gm-cell-group
            inset
            title="表单结果"
          >
            <gm-cell value={JSON.stringify(formModel)} />
          </gm-cell-group>
        </gm-body>
      </gm-app>
    )
  }
})
