import {
  cloneDeep,
  forOwn
} from 'lodash'

const processObject = (obj, func) => {
  let result = cloneDeep(obj)

  if (obj instanceof Array) {
    obj.forEach((value, index) => {
      result[index] = processObject(value, func)
    })
  } else if (obj instanceof Object) {
    forOwn(obj, (value, index) => {
      if (value instanceof Array) {
        value.forEach((item, itemIndex) => {
          result[index][itemIndex] = processObject(item, func)
        })
      } else if (value instanceof Object) {
        result[index] = processObject(value, func)
      } else {
        result[index] = func(value)
      }
    })
  } else if (typeof obj !== 'object') {
    result = func(obj)
  }

  return result
}

export default processObject
