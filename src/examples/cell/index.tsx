import { defineComponent } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'cell'
})

const [name] = BEM('cell', less)

export default defineComponent({
  name,

  setup() {
    return () => (
      <gm-app loading={false}>
        <gm-body>
          <gm-cell-group title="基础用法">
            <gm-cell title="单元格" value="内容" />
            <gm-cell title="单元格" label="描述信息" value="内容" />
          </gm-cell-group>
          <gm-cell-group inset title="卡片风格">
            <gm-cell title="单元格" value="内容" />
            <gm-cell title="单元格" label="描述信息" value="内容" />
          </gm-cell-group>
          <gm-cell-group title="收缩单元">
            <view style={{ padding: '0 32rpx' }}>
              <gm-cell shrink={false} title="单元格" value="内容" />
              <gm-cell shrink={false} title="单元格" label="描述信息" value="内容" />
            </view>
          </gm-cell-group>
          <gm-cell-group title="单元格大小">
            <gm-cell size="large" title="单元格" value="内容" />
            <gm-cell size="large" title="单元格" label="描述信息" value="内容" />
          </gm-cell-group>
          <gm-cell-group title="展示图标">
            <gm-cell icon="location-o" title="单元格" value="内容" />
          </gm-cell-group>
          <gm-cell-group title="展示箭头">
            <gm-cell title="单元格" isLink />
            <gm-cell title="单元格" value="内容" isLink />
            <gm-cell arrowDirection="down" title="单元格" value="内容" isLink />
          </gm-cell-group>
          <gm-cell-group title="页面跳转">
            <gm-cell url="home" linkQuery={{ id: 12 }} linkType="reLaunch" title="单元格" isLink />
          </gm-cell-group>
        </gm-body>
      </gm-app>
    )
  }
})
