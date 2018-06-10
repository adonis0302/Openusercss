import unquote from 'unquote'
import {
  forOwn,
} from 'lodash'

export default async (code) => {
  const commentsRegex = /\/\*[^*]*\*+([^\/][^*]*\*+)*\//g
  const comments = code.match(commentsRegex)
  let usercssComment = null

  const hasDefOpen = comments && comments[0].toLowerCase().includes('==userstyle==')
  const hasDefClose = comments && comments[0].toLowerCase().includes('==/userstyle==')
  const hasDef = hasDefOpen && hasDefClose
  const props = {
    'vars': [],
  }

  if (hasDef) {
    usercssComment = comments[0]
  } else {
    return {
      'props': null,
      code,
    }
  }

  const regex = /^\@[^@|\==\/]{0,}$/gim
  const matches = usercssComment.match(regex)

  matches.forEach((match) => {
    const declaration = match.split(' ').filter((item) => {
      return item !== ''
    })

    switch (declaration[0]) {
    case '@name':
      declaration.splice(0, 1)
      props.title = declaration.join(' ')
      break
    case '@description':
      declaration.splice(0, 1)
      props.description = declaration.join(' ')
      break
    case '@version':
      declaration.splice(0, 1)
      props.version = declaration.join(' ')
      break
    case '@var':
      declaration.splice(0, 1)
      props.vars.push(declaration.join(' '))
      break
    default:
      break
    }
  })

  props.vars.forEach((varString, varIndex) => {
    const line = varString.replace(/\n/g, '')
    const magic = /(^(text|color|checkbox|select))[\ ]{1,}([a-z,-]{1,})[\ ]{1,}([\',a-z\ ]{1,})(.*)/gim
    const trim = /^\s*(.*?)\s*$/
    const items = magic.exec(line)

    const type = items[2]
    const name = items[3]
    const label = unquote(trim.exec(items[4])[1])
    let value = []

    try {
      const rawValue = JSON.parse(items[5])

      if (Array.isArray(rawValue)) {
        value = rawValue
      } else if (rawValue instanceof Object) {
        forOwn(rawValue, (item, key) => {
          value.push({
            'label': key,
            'value': item,
          })
        })
      }
    } catch (error) {
      value = items[5]
    }

    props.vars[varIndex] = {
      type,
      name,
      label,
      value,
    }
  })

  return {
    'code': code.replace(/\/\*[^*]*\*+([^\/][^*]*\*+)*\//, ''),
    props,
  }
}
