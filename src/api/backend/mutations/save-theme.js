import stylelint from 'stylelint'

import mustAuthenticate from '../../../shared/enforce-session'
import {expected} from '../../../shared/custom-errors'

const {LintError} = expected

export default async (root, {token, title, description, content, scope, version, id}, {Session, Theme, User}) => {
  const session = await mustAuthenticate(token, Session)
  const user = await User.findOne({
    '_id': session.user._id
  })
  let newTheme = null

  const result = await stylelint.lint({
    'code':   content,
    'config': {
      'extends': 'stylelint-config-recommended-scss'
    }
  })

  if (result.results[0].errored) {
    throw new LintError(result.results[0].warnings)
  }

  if (id) {
    newTheme = await Theme.findOne({
      '_id': id
    })

    newTheme.title = title
    newTheme.description = description
    newTheme.version = version
    newTheme.scope = scope
    newTheme.content = content

    if (!newTheme) {
      throw new Error('No theme found')
    }
  } else {
    newTheme = Theme.create({
      'user': session.user,
      title,
      description,
      version,
      scope,
      content
    })
  }

  const savedTheme = await newTheme.save()

  user.themes.push(newTheme)
  await user.save()

  return savedTheme
}
