import { defineComponent, ref } from 'vue'

import { FooterBar } from '@/components/footer-bar'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'footer-bar'
})

const [name] = BEM('footer-bar', less)

export default defineComponent({
  name,

  setup() {
    const show = ref(false)

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <gm-button onTap={() => show.value = true}>显示</gm-button>
          <FooterBar>
            <gm-button block>按钮1</gm-button>
            {show.value ? <gm-button block>按钮2</gm-button> : null}
          </FooterBar>
        </gm-body>
      </gm-app>
    )
  }
})
