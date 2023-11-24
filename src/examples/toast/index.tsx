import { defineComponent } from 'vue'
import { useNavigationBar } from '@/hooks'

import { postLogin } from '@/api/user/login'

const [name] = BEM('toast')

export default defineComponent({
  name,

  setup() {
    useNavigationBar({
      title: 'toast'
    })

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
          <gm-cell-group inset>
            <gm-cell
              isLink
              title="显示loading"
              onTap={onShowLoading}
            />
            <gm-cell
              isLink
              title="显示toast"
              onTap={onShowToast}
            />
            <gm-cell
              isLink
              title="显示modal"
              onTap={onShowModal}
            />
            <gm-cell
              isLink
              title="显示modal-info"
              onTap={onShowModalInfo}
            />
          </gm-cell-group>
        </gm-body>
      </gm-app>
    )
  }
})
