import { App } from '@/components/app'
import { Space } from '@/components/space'
import { Alert } from '@/components/alert'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

const [name, bem] = Bem('alert', less)

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'alert'
})

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body shrink>
          <view class={bem('title')}>默认使用</view>
          <Space fill wrap direction="vertical">
            <Alert message="标题" type="normal" />
            <Alert message="标题" type="warning" />
            <Alert message="标题" type="info" />
            <Alert message="标题" type="success" />
            <Alert message="标题" type="error" />
          </Space>

          <view class={bem('title')}>带有图标</view>
          <Space fill wrap direction="vertical">
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
          </Space>

          <view class={bem('title')}>banner模式</view>
          <Space fill wrap direction="vertical">
            <Alert message="这里是内容，这里是内容，这里是内容" type="normal" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="warning" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="info" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="success" banner />
            <Alert message="这里是内容，这里是内容，这里是内容" type="error" banner />
          </Space>

          <view class={bem('title')}>关闭按钮</view>
          <Space fill wrap direction="vertical">
            <Alert message="标题" type="normal" closable />
            <Alert message="标题" type="warning" closable />
            <Alert message="标题" type="info" closable />
            <Alert message="标题" type="success" closable />
            <Alert message="标题" type="error" closable />
          </Space>

          <view class={bem('title')}>自定义关闭文本</view>
          <Space fill wrap direction="vertical">
            <Alert message="标题" type="normal" closeText="close" closable />
          </Space>

          <view class={bem('title')}>自定义图标</view>
          <Space fill wrap direction="vertical">
            <Alert message="标题" type="error" icon="wap-home" showIcon closable />
          </Space>
        </App.Body>
      </App>
    )
  }
})
