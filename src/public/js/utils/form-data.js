const processObject = async (object, func) => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object') {
      object[key] = processObject(object[key], func)
    } else {
      object[key] = func(key, object[key])
    }
  })

  return object
}

export default async (data) => {
  const processed = await processObject(data, (index, key) => {
    console.log('processing')
    console.log(index, key)
  })

  return 'empty'
}
