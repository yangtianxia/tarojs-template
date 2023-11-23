import { App } from '@/components/app'
import { Row, Col } from '@/components/grid'

import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'grid'
})

const [name, bem] = Bem('grid', less)

export default defineComponent({
  name,

  setup() {
    const progress = ref(0)

    setInterval(() => {
      if (progress.value === 24) {
        progress.value = 0
      } else {
        progress.value += 1
      }
    }, 1000 / 5)

    return () => (
      <App loading={false}>
        <App.Body shrink>
          {Array(24).fill(0).map((value, index) => (
            <Row gutter={[8, 8]}>
              <Col span={24 - (value + index)}>
                <view class={bem('col')}>{24 - (value + index)}</view>
              </Col>
            </Row>
          ))}
          <Row gutter={[8, 8]}>
            <Col span={progress.value}>
              <view class={bem('col')}>{progress.value}</view>
            </Col>
          </Row>
          <Row gutter={[8, 20]}>
            <Col span={12}>
              <view class={bem('col')}>10</view>
            </Col>
            <Col span={12}>
              <view class={bem('col')}>10</view>
            </Col>
          </Row>
          <Row gutter={[8, 20]}>
            <Col span={8}>
              <view class={bem('col')}>8</view>
            </Col>
            <Col span={8}>
              <view class={bem('col')}>8</view>
            </Col>
            <Col span={8}>
              <view class={bem('col')}>8</view>
            </Col>
          </Row>
          <Row gutter={[8, 20]}>
            <Col span={6}>
              <view class={bem('col')}>6</view>
            </Col>
            <Col span={6}>
              <view class={bem('col')}>6</view>
            </Col>
            <Col span={6}>
              <view class={bem('col')}>6</view>
            </Col>
            <Col span={6}>
              <view class={bem('col')}>6</view>
            </Col>
          </Row>
          <Row gutter={[8, 20]}>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
            <Col span={4}>
              <view class={bem('col')}>4</view>
            </Col>
          </Row>
        </App.Body>
      </App>
    )
  }
})
