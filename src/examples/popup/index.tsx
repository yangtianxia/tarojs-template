import { App } from '@/components/app'
import { CellGroup, Cell } from '@/components/cell'
import { Popup } from '@/components/popup'

import Bem from '@txjs/bem'
import { defineComponent, reactive } from 'vue'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'popup'
})

const [name] = Bem('popup', less)

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
      <App loading={false}>
        <App.Body shrink>
          <CellGroup inset>
            <Cell
              isLink
              title="center"
              onTap={() => model.center = true}
            />
            <Cell
              isLink
              title="top"
              onTap={() => model.top = true}
            />
            <Cell
              isLink
              title="bottom"
              onTap={() => model.bottom = true}
            />
            <Cell
              isLink
              title="left"
              onTap={() => model.left = true}
            />
            <Cell
              isLink
              title="right"
              onTap={() => model.right = true}
            />
          </CellGroup>
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
        </App.Body>
      </App>
    )
  }
})
