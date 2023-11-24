import { defineComponent, ref, reactive } from 'vue'

import { Field } from '@/components/form'
import { Popup } from '@/components/popup'
import { RangeDatePicker } from '@/components/range-date-picker'

import less from './index.module.less'

definePageConfig({
  navigationStyle: 'default',
  navigationBarTitleText: 'range-date-picker'
})

const [name] = BEM('range-date-picker', less)

export default defineComponent({
  name,

  setup() {
    const show = ref(false)
    const show1 = ref(false)
    const startdDate = ref<string[]>([])
    const endDate = ref<string[]>([])
    const startdDate1 = ref<string[]>([])
    const endDate1 = ref<string[]>([])

    const formModel = reactive({
      date: '',
      date1: ''
    })

    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <gm-cell-group inset>
            <Field
              readonly
              inputAlign="right"
              title="选择时间"
              value={formModel.date}
              placeholder="请选择时间"
              onTap={() => show.value = true}
            />
            <Field
              readonly
              inputAlign="right"
              title="快捷选择时间"
              value={formModel.date1}
              placeholder="请选择时间"
              onTap={() => show1.value = true}
            />
          </gm-cell-group>
        </gm-body>
        <Popup
          v-model:show={show.value}
          round
          titleBorder
          safeAreaInsetBottom
          title="选择时间"
          position="bottom"
        >
          <RangeDatePicker
            v-models={[
              [startdDate.value,  'start'],
              [endDate.value, 'end']
            ]}
            autoSearch
            onConfirm={(start, end) => formModel.date = `${start.join('-')}至${end.join('-')}`}
          />
        </Popup>
        <Popup
          v-model:show={show1.value}
          round
          titleBorder
          safeAreaInsetBottom
          title="选择时间"
          position="bottom"
        >
          <RangeDatePicker
            v-models={[
              [startdDate1.value,  'start'],
              [endDate1.value, 'end']
            ]}
            autoSearch
            presets={[
              { label: '近一个月', value: [new Date(year, month - 1, day), new Date()] },
              { label: '近三个月', value: [new Date(year, month - 3, day), new Date()] },
              { label: '近半年', value: [new Date(year, month - 6, day), new Date()] },
              { label: '近一年', value: [new Date(year - 1, month, day), new Date()] },
              { label: '近二年', value: [new Date(year - 2, month, day), new Date()] }
            ]}
            onConfirm={(start, end) => formModel.date1 = `${start.join('-')}至${end.join('-')}`}
          />
        </Popup>
      </gm-app>
    )
  }
})
