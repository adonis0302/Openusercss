import CSS from 'css'

const allowedProperties = [
  'name',
  'version',
  'description',
  'license'
]

export default async (code) => {
  const ast = CSS.parse(code)
  const props = {}
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
      const hasDef = rule.comment.toLowerCase().includes('==userstyle==')

      if (hasDef) {
        const lines = rule.comment.split('\n')

        lines.forEach((line) => {
          const regex = /^\@([a-z]{0,})\ (.*)$/gi
          const match = regex.exec(line)

          if (match && allowedProperties.includes(match[1])) {
            props[match[1]] = match[2]
          }
        })
      } else {
        transformedAst.stylesheet.rules.push(rule)
      }
    } else {
      transformedAst.stylesheet.rules.push(rule)
    }
  })

  return {
    'code': CSS.stringify(transformedAst),
    props
  }
}
