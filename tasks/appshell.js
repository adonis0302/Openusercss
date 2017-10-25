/* eslint no-invalid-this:0 no-underscore-dangle:0 */

import Conf from 'conf'

export const appConfig = new Conf({
  'cwd':        '.',
  'configName': 'config'
})

export const processObject = (object, func) => {
  for (const index in object) {
    if (typeof object[index] === 'object') {
      object[index] = processObject(object[index], func)
    } else {
      object[index] = func(index, object[index])
    }
  }

  return object
}
