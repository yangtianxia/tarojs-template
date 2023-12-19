const tinycolor2 = require('tinycolor2')
const { defineConfig } = require('pollen-css/utils')
const { shallowMerge, cloneDeep, omit } = require('@txjs/shared')
const { getCurrentTaroEnv } = require('../utils/cli')
const envUtils = require('../utils/env-utils')
const modules = require('./modules')

const UnitMatch = /([(-?\d)(\.\d)|\d])+(px)/ig

const taroEnv = getCurrentTaroEnv()

function toRatio(size) {
  return size === 1 ? size : size * 2
}

function pxToRpx(value) {
  const result = value.match(UnitMatch)
  if (result) {
    return result.reduce(
      (input, cur) => input.replace(cur, `${toRatio(parseFloat(cur))}rpx`), value
    )
  }
  return value
}

function pxTransform(values) {
  const shallowCopy = shallowMerge({}, values)
  if (taroEnv !== 'h5') {
    for (const key in values) {
      shallowCopy[key] = pxToRpx(values[key])
    }
  }
  return shallowCopy
}

function getAlphaColor(value) {
  const color = tinycolor2(value)
  if (color.isValid()) {
    return Object
      .values(color.toRgb())
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
  const cloneLight = cloneDeep(light || {})
  const cloneDark = cloneDeep(dark || {})
  const modules = omit(cloneLight, ['font', 'blur', 'width'])

  modules.color = {
    ...formatColor(cloneLight.color),
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

  modules.size = pxTransform({
    ...cloneLight.size,
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px'
  })

  modules.radius = pxTransform(
    modules.radius
  )

  for (const key in defaultConfig) {
    if (!Reflect.has(modules, key)) {
      Reflect.set(modules, key, false)
    }
  }

  const media = {}

  if (envUtils.isTruly(process.env.DARKMODE)) {
    Reflect.set(media, '(prefers-color-scheme: dark)', {
      ...cloneDark,
      size: pxTransform(cloneDark.size),
      color: formatColor(cloneDark.color)
    })
  }

  return {
    media,
    modules,
    selector: 'page',
    output: 'node_modules/pollen-css/pollen.css'
  }
})
