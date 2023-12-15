import bem from '@txjs/bem'

bem.config({
  debugger: process.env.ENV !== 'production',
  prefixer: {
    comp: process.env.PREFIX,
    page: 'page'
  }
})

export default bem
