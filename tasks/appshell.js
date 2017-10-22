/* eslint no-invalid-this:0 no-underscore-dangle:0 */

const Conf = require('conf')
const clyConfig = new Conf({
  'cwd':        '.',
  'configName': 'config'
})

const processObject = (object, func) => {
  for (const index in object) {
    if (typeof object[index] === 'object') {
      object[index] = processObject(object[index], func)
    } else {
      object[index] = func(index, object[index])
    }
  }

  return object
}

module.exports = {
  clyConfig,
  processObject
}
