import { Button } from '@/components/button'
import { FooterBar } from '@/components/footer-bar'

import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'footer-bar'
})

const [name] = Bem('footer-bar', less)

export default defineComponent({
  name,

  setup() {
    const show = ref(false)

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <Button onTap={() => show.value = true}>显示</Button>

          <FooterBar>
            <Button block>按钮1</Button>
            {show.value ? <Button block>按钮2</Button> : null}
          </FooterBar>
        </gm-body>
      </gm-app>
    )
  }
})
