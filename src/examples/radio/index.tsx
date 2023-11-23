import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { Space } from '@/components/space'
import { Radio } from '@/components/radio'

import Bem from '@txjs/bem'
import { defineComponent, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'radio'
})

const [name, bem] = Bem('radio', less)

export default defineComponent({
  name,

  setup() {
    const radio = reactive({
      a1: 1,
      a2: 1,
      a3: 2,
      a4: 1,
      a5: 1,
      a6: 1,
      a7: 1
    })

    return () => (
      <App loading={false}>
        <App.Body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>基础用法</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a1}>
                <Space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>水平布局</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a2} direction="horizontal">
                <Radio name={1}>复选框1</Radio>
                <Radio name={2}>复选框2</Radio>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用状态</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group disabled v-model:value={radio.a3}>
                <Space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义形状</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a3}>
                <Space direction="vertical">
                  <Radio shape="square" name={1}>复选框1</Radio>
                  <Radio shape="square" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义颜色</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a4}>
                <Space direction="vertical">
                  <Radio checkedColor="var(--color-danger)" name={1}>复选框1</Radio>
                  <Radio checkedColor="var(--color-danger)" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>左侧文本</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a5}>
                <Space direction="vertical">
                  <Radio labelPosition="left" name={1}>复选框1</Radio>
                  <Radio labelPosition="left" name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用文本点击</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a6}>
                <Space direction="vertical">
                  <Radio labelDisabled name={1}>复选框1</Radio>
                  <Radio labelDisabled name={2}>复选框2</Radio>
                </Space>
              </Radio.Group>
            </view>
          </view>

          <Radio.Group v-model:value={radio.a7}>
            <CellGroup inset title="搭配单元格组件使用">
              <Cell
                clickable
                title="复选框a"
                onTap={() => radio.a7 = 1}
                v-slots={{
                  'right-icon': () => (
                    <Radio
                      name={1}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}
              />
              <Cell
                clickable
                title="复选框b"
                onTap={() => radio.a7 = 2}
                v-slots={{
                  'right-icon': () => (
                    <Radio
                      name={2}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}
              />
            </CellGroup>
          </Radio.Group>
        </App.Body>
      </App>
    )
  }
})
