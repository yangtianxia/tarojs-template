import { defineComponent, reactive } from 'vue'

import { Radio } from '@/components/radio'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'radio'
})

const [name, bem] = BEM('radio', less)

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
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>基础用法</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a1}>
                <gm-space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </gm-space>
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
                <gm-space direction="vertical">
                  <Radio name={1}>复选框1</Radio>
                  <Radio name={2}>复选框2</Radio>
                </gm-space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义形状</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a3}>
                <gm-space direction="vertical">
                  <Radio shape="square" name={1}>复选框1</Radio>
                  <Radio shape="square" name={2}>复选框2</Radio>
                </gm-space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义颜色</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a4}>
                <gm-space direction="vertical">
                  <Radio checkedColor="var(--color-danger)" name={1}>复选框1</Radio>
                  <Radio checkedColor="var(--color-danger)" name={2}>复选框2</Radio>
                </gm-space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>左侧文本</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a5}>
                <gm-space direction="vertical">
                  <Radio labelPosition="left" name={1}>复选框1</Radio>
                  <Radio labelPosition="left" name={2}>复选框2</Radio>
                </gm-space>
              </Radio.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用文本点击</view>
            <view class={bem('section-wrapper')}>
              <Radio.Group v-model:value={radio.a6}>
                <gm-space direction="vertical">
                  <Radio labelDisabled name={1}>复选框1</Radio>
                  <Radio labelDisabled name={2}>复选框2</Radio>
                </gm-space>
              </Radio.Group>
            </view>
          </view>

          <Radio.Group v-model:value={radio.a7}>
            <gm-cell-group inset title="搭配单元格组件使用">
              <gm-cell
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
              <gm-cell
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
            </gm-cell-group>
          </Radio.Group>
        </gm-body>
      </gm-app>
    )
  }
})
