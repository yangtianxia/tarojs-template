import { defineComponent, ref } from 'vue'

import { Tabs, Tab } from '@/components/tabs'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'tabs'
})

const [name, bem] = BEM('tabs', less)

export default defineComponent({
  name,

  setup() {
    const tabKey = ref(0)
    const tabKey1 = ref(0)
    const tabKey2 = ref(0)

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>常规使用</view>
            <view class={bem('section-wrapper')} style={{ background: 'var(--color-bgcolor)' }}>
              <Tabs v-model:value={tabKey.value}>
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>card类型</view>
            <view class={bem('section-wrapper')}>
              <Tabs
                v-model:value={tabKey.value}
                type="card"
              >
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>card-1类型</view>
            <view class={bem('section-wrapper')}>
              <Tabs
                v-model:value={tabKey2.value}
                type="card"
              >
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>圆角</view>
            <view class={bem('section-wrapper')} style={{ background: 'var(--color-bgcolor)' }}>
              <Tabs
                v-model:value={tabKey.value}
                radius
              >
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>圆角</view>
            <view class={bem('section-wrapper')}>
              <Tabs
                v-model:value={tabKey.value}
                radius
                type="card"
              >
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>滚动</view>
            <view class={bem('section-wrapper')} style={{ background: 'var(--color-bgcolor)' }}>
              <Tabs v-model:value={tabKey1.value}>
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
                <Tab>按钮4</Tab>
                <Tab>按钮5</Tab>
                <Tab>按钮6</Tab>
              </Tabs>
            </view>
          </view>
        </gm-body>
      </gm-app>
    )
  }
})
