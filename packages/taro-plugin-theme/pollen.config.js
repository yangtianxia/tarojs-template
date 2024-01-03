const tinycolor2 = require('tinycolor2')
const { defineConfig } = require('pollen-css/utils')
const { shallowMerge, pick } = require('@txjs/shared')
const { getCurrentTaroEnv } = require('../utils/cli')
const envUtils = require('../utils/env-utils')
const { getCurrentColor } = require('./color')

const taroEnv = getCurrentTaroEnv()

const UnitMatch = /([(-?\d)(\.\d)|\d])+(px)/ig

function toRatio(size) {
  size = parseFloat(size)
  return size === 1 ? size : size * 2
}

function pxToRpx(value) {
  const found = value.match(UnitMatch)

  if (found) {
    return found.reduce(
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
  const modules = pick(defaultConfig, ['size', 'radius', 'line', 'layer', 'weight', 'shadow'])
  const colors = getCurrentColor()

  modules.visibility = {
    none: 0,
    1: 0.2,
    2: 0.4,
    3: 0.6,
    4: 0.8,
    5: 1
  }

  modules.duration = {
    fast: '0.2s',
    slow: '0.3s',
    turtle: '0.5s'
  }

  modules.color = {
    ...formatColor(colors.light),
    grey: 'var(--color-grey-6)',
    primary: 'var(--color-primary-6)',
    active: 'var(--color-grey-5)',
    bgcolor: 'var(--color-grey-4)',
    border: 'var(--color-grey-5)',
    text: 'var(--color-grey-10)',
    'text-base': 'var(--color-grey-9)',
    'text-light': 'var(--color-grey-8)',
    'text-weak': 'var(--color-grey-7)',
  }

  modules.size = pxTransform({
    ...modules.size,
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  })

  modules.radius = pxTransform(modules.radius)

  for (const key in defaultConfig) {
    if (!Reflect.has(modules, key)) {
      Reflect.set(modules, key, false)
    }
  }

  const media = {}

  if (envUtils.isTruly(process.env.DARKMODE)) {
    Reflect.set(media, '(prefers-color-scheme: dark)', {
      color: formatColor(colors.dark)
    })
  }

  return {
    media,
    modules,
    selector: 'page',
    output: 'node_modules/pollen-css/pollen.css'
  }
})
