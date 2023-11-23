import { App } from '@/components/app'
import { Cell, CellGroup } from '@/components/cell'

import Bem from '@txjs/bem'
import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'cell'
})

const [name] = Bem('cell', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <App loading={false}>
        <App.Body>
          <CellGroup title="基础用法">
            <Cell title="单元格" value="内容" />
            <Cell title="单元格" label="描述信息" value="内容" />
          </CellGroup>
          <CellGroup inset title="卡片风格">
            <Cell title="单元格" value="内容" />
            <Cell title="单元格" label="描述信息" value="内容" />
          </CellGroup>
          <CellGroup title="收缩单元">
            <view style={{ padding: '0 32rpx' }}>
              <Cell shrink={false} title="单元格" value="内容" />
              <Cell shrink={false} title="单元格" label="描述信息" value="内容" />
            </view>
          </CellGroup>
          <CellGroup title="单元格大小">
            <Cell size="large" title="单元格" value="内容" />
            <Cell size="large" title="单元格" label="描述信息" value="内容" />
          </CellGroup>
          <CellGroup title="展示图标">
            <Cell icon="location-o" title="单元格" value="内容" />
          </CellGroup>
          <CellGroup title="展示箭头">
            <Cell title="单元格" isLink />
            <Cell title="单元格" value="内容" isLink />
            <Cell arrowDirection="down" title="单元格" value="内容" isLink />
          </CellGroup>
          <CellGroup title="页面跳转">
            <Cell url="home" linkQuery={{ id: 12 }} linkType="reLaunch" title="单元格" isLink />
          </CellGroup>
        </App.Body>
      </App>
    )
  }
})
