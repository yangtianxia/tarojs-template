const path = require('path')

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

module.exports = {
  pathResolve,
  resolve,
  toJSON
}
