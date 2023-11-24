import { defineComponent } from 'vue'

import { Alert } from '@/components/alert'

import less from './index.module.less'

const [name, bem] = BEM('alert', less)

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'alert'
})

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <view class={bem('title')}>默认使用</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="标题" type="normal" />
            <Alert message="标题" type="warning" />
            <Alert message="标题" type="info" />
            <Alert message="标题" type="success" />
            <Alert message="标题" type="error" />
          </gm-space>

          <view class={bem('title')}>带有图标</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="标题" type="normal" showIcon />
            <Alert message="标题" type="warning" showIcon />
            <Alert message="标题" type="info" showIcon />
            <Alert message="标题" type="success" showIcon />
            <Alert message="标题" type="error" showIcon />

            <Alert message="标题" description="这里是内容" type="normal" showIcon />
            <Alert message="标题" description="这里是内容" type="warning" showIcon />
            <Alert message="标题" description="这里是内容" type="info" showIcon />
            <Alert message="标题" description="这里是内容" type="success" showIcon />
            <Alert message="标题" description="这里是内容" type="error" showIcon closable />
          </gm-space>

          <view class={bem('title')}>banner模式</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="这里是内容，这里是内容，这里是内容" type="normal" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="warning" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="info" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="success" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="error" banner />
          </gm-space>

          <view class={bem('title')}>关闭按钮</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="标题" type="normal" closable />
            <Alert message="标题" type="warning" closable />
            <Alert message="标题" type="info" closable />
            <Alert message="标题" type="success" closable />
            <Alert message="标题" type="error" closable />
          </gm-space>

          <view class={bem('title')}>自定义关闭文本</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="标题" type="normal" closeText="close" closable />
          </gm-space>

          <view class={bem('title')}>自定义图标</view>
          <gm-space fill wrap direction="vertical">
            <Alert message="标题" type="error" icon="wap-home" showIcon closable />
          </gm-space>
        </gm-body>
      </gm-app>
    )
  }
})
