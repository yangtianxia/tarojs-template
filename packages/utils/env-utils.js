const { notNil } = require('@txjs/bool')

class EnvUtils {
  constructor () {}

  parse(value, sourceEnv) {
    if (value.startsWith('@')) {
      const keys = value.split('@')
      value = keys
        .reduce((chunks, key) => {
          if (Reflect.has(sourceEnv, key)) {
            chunks.push(Reflect.get(sourceEnv, key))
          }
          return chunks
        }, [])
        .join('')
    }
    return JSON.stringify(value)
  }

  toName(value) {
    return notNil(value) ? `process.env.${value}` : ''
  }

  cleanKey(value) {
    return notNil(value) ? value.replace(/^process\.env\./, '') : ''
  }

  cleanValue(value) {
    return notNil(value) ? JSON.parse(value) : ''
  }

  isValid(value) {
    return value != null && value != '""'
  }

  isTruly(value) {
    return this.isValid(value) ? /^true$/i.test(value) : false
  }
}

module.exports = new EnvUtils()
