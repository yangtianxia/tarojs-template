const { generate, presetPalettes, presetDarkPalettes } = require('@ant-design/colors')
const { omit } = require('@txjs/shared')
const { getCurrentTaroEnv } = require('../utils/cli')

const taroEnv = getCurrentTaroEnv()

const presetPrimaryColors = {
  default: '#00C074',
  grey: '#CCCCCC'
}

const primaryColor = presetPrimaryColors[taroEnv] || presetPrimaryColors['default']

presetPalettes.primary = generate(primaryColor)
presetDarkPalettes.primary = generate(primaryColor, {
  theme: 'dark',
  backgroundColor: '#141414'
})

function formatKey(obj) {
  const colors = {}
  Object.keys(obj).forEach((key) => {
    const item = obj[key]
    item.forEach((color, index) => {
      colors[`${key}-${index + 1}`] = color
    })
  })
  return colors
}

function getCurrentColor() {
  return {
    light: {
      ...formatKey(
        omit(presetPalettes, ['grey'])
      ),
      'grey-1': '#F9FAFB',
      'grey-2': '#F8F8F8',
      'grey-3': '#F7F8FA',
      'grey-4': '#F5F5F5',
      'grey-5': '#EEEEEE',
      'grey-6': '#DCDEE0',
      'grey-7': '#CCCCCC',
      'grey-8': '#999999',
      'grey-9': '#666666',
      'grey-10': '#333333',
      navigation: 'black',
      section: '#FFFFFF'
    },
    dark: {
      ...formatKey(
        omit(presetDarkPalettes, ['grey'])
      ),
      'grey-1': '#161616',
      'grey-2': '#191919',
      'grey-3': '#292929',
      'grey-4': '#494949',
      'grey-5': '#58595A',
      'grey-6': '#656565',
      'grey-7': '#A2A2A2',
      'grey-8': '#D0D0D0',
      'grey-9': '#EFEFEF',
      'grey-10': '#F7F7F7',
      navigation: 'white',
      section: '#141414',
    }
  }
}

module.exports = {
  getCurrentColor
}
