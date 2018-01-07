import CSS from 'css'
import unquote from 'unquote'
import {forOwn} from 'lodash'

export default async (code) => {
  const ast = CSS.parse(code)
  const props = {
    'vars': []
  }
  const transformedAst = {
    'type':       'stylesheet',
    'stylesheet': {
      'rules': []
    }
  }

  if (ast.type !== 'stylesheet') {
    throw new Error('Source code is not of type "stylesheet"')
  }

  ast.stylesheet.rules.forEach((rule, ruleIndex) => {
    if (rule.type === 'comment' && rule.comment) {
      const hasDefOpen = rule.comment.toLowerCase().includes('==userstyle==')
      const hasDefClose = rule.comment.toLowerCase().includes('==/userstyle==')
      const hasDef = hasDefOpen && hasDefClose

      if (hasDef) {
        const regex = /^\@[^@|\==\/]{0,}$/gim
        const matches = rule.comment.match(regex)

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
      } else {
        transformedAst.stylesheet.rules.push(rule)
      }
    } else {
      transformedAst.stylesheet.rules.push(rule)
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

      if (rawValue instanceof Array) {
        value = rawValue
      } else if (rawValue instanceof Object) {
        forOwn(rawValue, (item, key) => {
          value.push({
            'label': key,
            'value': item
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
      value
    }
  })

  return {
    'code': CSS.stringify(transformedAst),
    props
  }
}
