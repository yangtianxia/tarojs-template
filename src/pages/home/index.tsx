import { defineComponent, ref, shallowRef } from 'vue'
import { useNavigationBar } from '@/hooks'
import { useAreaData } from '@/shared/area-data'

import { Popup } from '@/components/popup'
import { Cascader } from '@/components/cascader'
import { Button } from '@/components/button'
import { FooterBar } from '@/components/footer-bar'
import { Sticky } from '@/components/sticky'
import { Alert } from '@/components/alert'

import less from './index.module.less'

const [name] = BEM('home', less)

export default defineComponent({
  name,

  setup() {
    const navigationBar = useNavigationBar()

    const areaData = shallowRef(
      useAreaData()
    )
    const cacsaderValue = ref('421303')
    const visible = ref(false)
    const visible1 = ref(false)

    return () => (
      <gm-app loading={false}>
        <gm-body>
          <Sticky offsetTop={navigationBar.height.value}>
            <gm-cell
              isLink
              title="弹窗"
              onTap={() => visible.value = true}
            />
          </Sticky>
          <Alert message="d" />
          <FooterBar>
            {visible1.value ? (
              <Button block>内容</Button>
            ) : null}
            <view></view>
            <Button block onTap={() => visible1.value = true}>提交</Button>
          </FooterBar>
        </gm-body>
        <Popup
          v-model:show={visible.value}
          round
          closeable
          safeAreaInsetBottom
          scrolling={300}
          position="bottom"
          title="填写地址"
        >
          <Cascader
            v-model:value={cacsaderValue.value}
            options={areaData.value}
          />
        </Popup>
      </gm-app>
    )
  }
})
