import {findIndex, cloneDeep, defaultsDeep} from 'lodash'

// This function takes source (array), and merges newDataArgs
// into it by key, then returns it

export default (source, key, ...newDataArgs) => {
  if (!(source instanceof Array)) {
    throw new Error(`Source must be of type Array, got ${typeof source}: ${JSON.stringify(source)}`)
  }
  newDataArgs.forEach((newDatas) => {
    if (!(newDatas instanceof Array)) {
      throw new Error(`Each data argument must be of type Array, got ${typeof newDatas}: ${JSON.stringify(newDatas)}`)
    }
    newDatas.forEach((newData) => {
      if (!(newData instanceof Object)) {
        throw new Error(`Each data must be of type Object, got ${typeof newDatas}: ${JSON.stringify(newData)}`)
      }
    })
  })

  const sourceCopy = cloneDeep(source)

  // Iterate over all the new data we're supplied with
  newDataArgs.forEach((newDataArg) => {
    newDataArg.forEach((newData) => {
      const index = findIndex(sourceCopy, {
        [key]: newData[key]
      })

      if (index === -1) {
        // If the new data doesn't exist in the source, add it to the top
        sourceCopy.unshift(newData)
      } else {
        // If it does exist, overwrite the old values with the new ones
        sourceCopy[index] = defaultsDeep(newData, sourceCopy[index])
      }
    })
  })

  return sourceCopy
}

// For example:
/*
source: [
  {
    'id': 0,
    'age': 54,
    'gender': 'female'
  },
  {
    'id': 1,
    'age': 43,
    'gender': 'male'
  }
]
key: 'id'
newDataArgs: [
  {
    'id': 0,
    'uiTheme': 'dark',
    'age': 55
  },
  {
    'id': 2,
    'age': 22
  }
]

returns: [
  {
    'id': 0,
    'age': 55,
    'gender': 'female',
    'uiTheme': 'dark'
  },
  {
    'id': 1,
    'age': 43,
    'gender': 'male'
  },
  {
    'id': 2,
    'age': 22
  }
]
*/
