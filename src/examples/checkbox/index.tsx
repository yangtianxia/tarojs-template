import { defineComponent, ref, reactive } from 'vue'

import { Checkbox, type CheckboxGroupInstance, type CheckboxInstance } from '@/components/checkbox'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'checkbox'
})

const [name, bem] = BEM('checkbox', less)

export default defineComponent({
  name,

  setup() {
    const checkboxGroupRef = ref<CheckboxGroupInstance>()
    const checkboxRefs = ref<CheckboxInstance[]>([])
    const checkbox = reactive({
      a1: true,
      a2: true,
      a3: true,
      a4: true,
      a5: true,
      a6: true,
      a7: true,
      a8: true,
      a9: [],
      a10: [],
      a11: [],
      a12: []
    })

    const checkAll = () => {
      checkboxGroupRef.value?.toggleAll(true)
    }

    const toggleAll = () => {
      checkboxGroupRef.value?.toggleAll()
    }

    const toggle = (index: number) => {
      checkboxRefs.value[index].toggle()
    }

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>基础用法</view>
            <view class={bem('section-wrapper')}>
              <Checkbox v-model:value={checkbox.a1}>复选框</Checkbox>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用状态</view>
            <view class={bem('section-wrapper')}>
              <gm-space direction="vertical">
                <Checkbox disabled>复选框</Checkbox>
                <Checkbox disabled v-model:value={checkbox.a2}>复选框</Checkbox>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义形状</view>
            <view class={bem('section-wrapper')}>
              <Checkbox shape="square" v-model:value={checkbox.a3}>自定义形状</Checkbox>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>自定义颜色</view>
            <view class={bem('section-wrapper')}>
              <Checkbox checkedColor="var(--color-danger)" v-model:value={checkbox.a4}>自定义颜色</Checkbox>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>左侧文本</view>
            <view class={bem('section-wrapper')}>
              <Checkbox labelPosition="left" v-model:value={checkbox.a5}>左侧文本</Checkbox>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用文本点击</view>
            <view class={bem('section-wrapper')}>
              <Checkbox labelDisabled v-model:value={checkbox.a6}>复选框</Checkbox>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>基础用法</view>
            <view class={bem('section-wrapper')}>
              <gm-space direction="vertical">
                <Checkbox v-model:value={checkbox.a7}>复选框a</Checkbox>
                <Checkbox v-model:value={checkbox.a8}>复选框b</Checkbox>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>水平排版</view>
            <view class={bem('section-wrapper')}>
              <Checkbox.Group v-model:value={checkbox.a9} direction="horizontal">
                <Checkbox name="a">复选框a</Checkbox>
                <Checkbox name="b">复选框b</Checkbox>
              </Checkbox.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>限制最大可选数</view>
            <view class={bem('section-wrapper')}>
              <Checkbox.Group v-model:value={checkbox.a10} max={2}>
                <gm-space direction="vertical">
                  <Checkbox name="a">复选框a</Checkbox>
                  <Checkbox name="b">复选框b</Checkbox>
                  <Checkbox name="c">复选框c</Checkbox>
                </gm-space>
              </Checkbox.Group>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>全选或反选</view>
            <view class={bem('section-wrapper')}>
              <Checkbox.Group v-model:value={checkbox.a11} ref={checkboxGroupRef}>
                <gm-space direction="vertical">
                  <Checkbox name="a">复选框a</Checkbox>
                  <Checkbox name="b">复选框b</Checkbox>
                  <Checkbox name="c">复选框c</Checkbox>
                </gm-space>
              </Checkbox.Group>
              <gm-space style={{ marginTop: '12px' }}>
                <gm-button type="primary" size="mini" onTap={checkAll}>全选</gm-button>
                <gm-button type="primary" size="mini" onTap={toggleAll}>反选</gm-button>
              </gm-space>
            </view>
          </view>

          <Checkbox.Group v-model:value={checkbox.a12}>
            <gm-cell-group inset title="搭配单元格组件使用">
              <gm-cell
                clickable
                title="复选框a"
                onTap={() => toggle(0)}
                v-slots={{
                  'right-icon': () => (
                    <Checkbox
                      name="a"
                      ref={(el: CheckboxInstance) => checkboxRefs.value.push(el)}
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
                onTap={() => toggle(1)}
                v-slots={{
                  'right-icon': () => (
                    <Checkbox
                      name="b"
                      ref={(el: CheckboxInstance) => checkboxRefs.value.push(el)}
                      onTap={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    />
                  )
                }}
              />
            </gm-cell-group>
          </Checkbox.Group>
        </gm-body>
      </gm-app>
    )
  }
})
