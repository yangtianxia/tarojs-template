const tinycolor2 = require('tinycolor2')
const { defineConfig } = require('pollen-css/utils')
const { shallowMerge } = require('@txjs/shared')
const { getCurrentTheme } = require('./modules')
const { getCurrentTaroEnv } = require('../utils/cli')
const envUtils = require('../utils/env-utils')

const taroEnv = getCurrentTaroEnv()

const UnitMatch = /([(-?\d)(\.\d)|\d])+(px)/ig

function toRatio(size) {
  size = parseFloat(size)
  return size === 1 ? size : size * 2
}

function pxToRpx(value) {
  const result = value.match(UnitMatch)
  if (result) {
    return result.reduce(
      (input, numeric) => input.replace(numeric, `${toRatio(numeric)}rpx`), value
    )
  }
  return value
}

function pxTransform(values) {
  const shallowCopy = shallowMerge({}, values)
  if (taroEnv !== 'h5') {
    for (const key in values) {
      const value = Reflect.get(values, key)
      Reflect.set(shallowCopy, key, pxToRpx(value))
    }
  }
  return shallowCopy
}

function getAlphaColor(value) {
  const color = tinycolor2(value)
  if (color.isValid()) {
    return Object
      .values(
        color.toRgb()
      )
      .slice(0, 3)
      .toString()
  }
  return value
}

function formatColor(colors = {}) {
  return Object
    .keys(colors)
    .reduce(
      (obj, key) => {
        const value = Reflect.get(colors, key)
        const color = getAlphaColor(value)
        const baseName = `${key}-base`
        Reflect.set(obj, baseName, color)
        Reflect.set(obj, key, `rgb(var(--color-${baseName}))`)
        return obj
      }, {}
    )
}

module.exports = defineConfig((defaultConfig) => {
  const { light, dark } = getCurrentTheme()

  light.color = {
    ...formatColor(light.color),
    grey: 'var(--color-grey-500)',
    info: 'var(--color-info-500)',
    primary: 'var(--color-primary-500)',
    danger: 'var(--color-danger-500)',
    warning: 'var(--color-warning-500)',
    success: 'var(--color-success-500)',
    active: 'var(--color-grey-300)',
    bgcolor: 'var(--color-grey-200)',
    border: 'var(--color-grey-300)',
    text: 'var(--color-grey-800)',
    'text-base': 'var(--color-grey-700)',
    'text-light': 'var(--color-grey-600)',
    'text-weak': 'var(--color-grey-500)',
  }

  light.size = pxTransform({
    ...light.size,
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  })

  light.radius = pxTransform(light.radius)

  for (const key in defaultConfig) {
    if (!Reflect.has(light, key)) {
      Reflect.set(light, key, false)
    }
  }

  const media = {}

  // 暗黑模式仅处理 color
  if (envUtils.isTruly(process.env.DARKMODE)) {
    Reflect.set(media, '(prefers-color-scheme: dark)', {
      color: formatColor(dark.color)
    })
  }

  return {
    media,
    modules: light,
    selector: 'page',
    output: 'node_modules/pollen-css/pollen.css'
  }
})
