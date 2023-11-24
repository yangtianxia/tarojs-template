import { defineComponent, reactive } from 'vue'

import { Popup } from '@/components/popup'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'popup'
})

const [name] = BEM('popup', less)

export default defineComponent({
  name,

  setup() {
    const model = reactive({
      top: false,
      bottom: false,
      left: false,
      right: false,
      center: false
    })

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <gm-cell-group inset>
            <gm-cell
              isLink
              title="center"
              onTap={() => model.center = true}
            />
            <gm-cell
              isLink
              title="top"
              onTap={() => model.top = true}
            />
            <gm-cell
              isLink
              title="bottom"
              onTap={() => model.bottom = true}
            />
            <gm-cell
              isLink
              title="left"
              onTap={() => model.left = true}
            />
            <gm-cell
              isLink
              title="right"
              onTap={() => model.right = true}
            />
          </gm-cell-group>
          <Popup
            v-model:show={model.center}
            round
            position="center"
          >
            <view style={{ width: '200px', height: '200px' }}></view>
          </Popup>
          <Popup
            v-model:show={model.top}
            round
            position="top"
            closeIconPosition="bottom-right"
          >
            <view style={{ height: '200px' }}></view>
          </Popup>
          <Popup
            v-model:show={model.bottom}
            round
            closeable
            title="bottom"
            position="bottom"
          >
            <view style={{ height: '200px' }}></view>
          </Popup>
          <Popup
            v-model:show={model.left}
            position="left"
            style={{ height: '100%', width: '80%' }}
          >
          </Popup>
          <Popup
            v-model:show={model.right}
            position="right"
            style={{ height: '100%', width: '80%' }}
          >
          </Popup>
        </gm-body>
      </gm-app>
    )
  }
})
