const path = require('path')
const { camelize } = require('@txjs/shared')
const { isPlainObject } = require('@txjs/bool')

function pathResolve(...dir) {
  return path.resolve(...dir)
}

function resolve(...dir) {
  return pathResolve(process.cwd(), ...dir)
}

function toJSON(input) {
  if (!input) {
    throw new Error('input cannot be empty')
  }

  try {
    return JSON.parse(input)
  } catch (err) {
    throw new Error(err)
  }
}

function camelCase(obj = {}) {
  return Object
    .keys(obj)
    .reduce((newObj, key) => {
      let value = Reflect.get(obj, key)
      if (isPlainObject(value)) {
        value = camelCase(value)
      }
      Reflect.set(newObj, camelize(key), value)
      return newObj
    }, {})
}

module.exports = {
  pathResolve,
  resolve,
  toJSON,
  camelCase
}
