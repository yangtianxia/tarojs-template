import BEM from '@txjs/bem'

BEM.config({
  debugger: process.env.ENV !== 'production',
  prefixer: {
    comp: process.env.PREFIX,
    page: 'page'
  }
})

export default BEM
