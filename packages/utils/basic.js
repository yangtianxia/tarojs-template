const path = require('path')

function resolve(...dir) {
  return path.resolve(process.cwd(), ...dir)
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

module.exports = {
  resolve,
  toJSON
}
