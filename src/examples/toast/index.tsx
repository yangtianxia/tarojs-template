import Bem from '@txjs/bem'
import { defineComponent, ref } from 'vue'
import { useNavigationBar } from '@/hooks'

import { Cell, CellGroup } from '@/components/cell'

import { postLogin } from '@/api/user/login'

const [name] = Bem('toast')

export default defineComponent({
  name,

  setup() {
    useNavigationBar({
      title: 'toast'
    })

    const count = ref(1000)

    const onShowLoading = async () => {
      toast.loading()
      try {
        await postLogin({})
      } catch (err) {
        console.log(err)
      } finally {
        toast.hide()
        console.log('hide')
      }
    }

    const onShowToast = () => {
      toast.info('toast')
    }

    const onShowModal = () => {
      modal.confirm({
        title: 'modal-title',
        content: 'modal-content'
      })
    }

    const onShowModalInfo = () => {
      modal.info({
        content: 'modal-info',
        onOk: () => {}
      })
    }

    return () => (
      <gm-app loading={false}>
        <gm-body shrink>
          <CellGroup
            inset
            shrink={false}
          >
            <Cell
              isLink
              title="显示loading"
              onTap={onShowLoading}
            />
            <Cell
              isLink
              title="显示toast"
              onTap={onShowToast}
            />
            <Cell
              isLink
              title="显示modal"
              onTap={onShowModal}
            />
            <Cell
              isLink
              title="显示modal-info"
              onTap={onShowModalInfo}
            />
          </CellGroup>
        </gm-body>
      </gm-app>
    )
  }
})
