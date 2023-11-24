import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'gm-button'
})

const [name, bem] = BEM('button', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('section')}>
            <view class={bem('title')}>按钮类型</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button type="default">默认按钮</gm-button>
                <gm-button type="light">light按钮</gm-button>
                <gm-button type="primary">主要按钮</gm-button>
                <gm-button type="success">成功按钮</gm-button>
                <gm-button type="danger">危险按钮</gm-button>
                <gm-button type="warning">警告按钮</gm-button>
                <gm-button link type="primary">链接按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>链接按钮</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button link type="default">默认按钮</gm-button>
                <gm-button link type="primary">主要按钮</gm-button>
                <gm-button link type="success">成功按钮</gm-button>
                <gm-button link type="danger">危险按钮</gm-button>
                <gm-button link type="warning">警告按钮</gm-button>
              </gm-space>
              <gm-space wrap>
                <gm-button link size="small" type="default">默认按钮</gm-button>
                <gm-button link size="small" type="primary">主要按钮</gm-button>
                <gm-button link size="small" type="success">成功按钮</gm-button>
                <gm-button link size="small" type="danger">危险按钮</gm-button>
                <gm-button link size="small" type="warning">警告按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>朴素按钮</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button plain type="danger">朴素按钮</gm-button>
                <gm-button plain type="primary">朴素按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>禁用状态</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button disabled type="danger">禁用按钮</gm-button>
                <gm-button disabled type="primary">禁用按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>加载状态</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button loading type="danger">加载按钮</gm-button>
                <gm-button loading loadingText="加载中" type="primary">加载按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>按钮形状</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button type="default">方形按钮</gm-button>
                <gm-button round type="primary">半圆按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>图标按钮</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button icon="delete" type="danger"></gm-button>
                <gm-button icon="wechat" type="primary">微信</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>按钮尺寸</view>
            <view class={bem('section-wrapper')}>
              <gm-space fill wrap direction="vertical">
                <gm-button block size="large" type="primary">大按钮</gm-button>
                <gm-button block type="primary">常规按钮</gm-button>
                <gm-button block size="small" type="primary">小按钮</gm-button>
                <gm-button block size="mini" type="primary">最小按钮</gm-button>
              </gm-space>
              <gm-space wrap>
                <gm-button size="large" type="primary">大按钮</gm-button>
                <gm-button type="primary">常规按钮</gm-button>
                <gm-button size="small" type="primary">小按钮</gm-button>
                <gm-button size="mini" type="primary">最小按钮</gm-button>
              </gm-space>
            </view>
          </view>

          <view class={bem('section')}>
            <view class={bem('title')}>路由跳转</view>
            <view class={bem('section-wrapper')}>
              <gm-space wrap>
                <gm-button url="home" linkType="reLaunch" type="primary">访问home</gm-button>
              </gm-space>
            </view>
          </view>
        </gm-body>
      </gm-app>
    )
  }
})
