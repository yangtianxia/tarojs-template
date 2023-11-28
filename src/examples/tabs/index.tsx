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

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>按钮类型</view>
            <view class={bem('section-wrapper')}>
              <Tabs v-model:value={tabKey.value}>
                <Tab>按钮1</Tab>
                <Tab>按钮2</Tab>
                <Tab>按钮3</Tab>
              </Tabs>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>按钮类型</view>
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
            <view class={bem('title')}>按钮类型</view>
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
        </gm-body>
      </gm-app>
    )
  }
})
