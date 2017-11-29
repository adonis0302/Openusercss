import {escape} from 'html-escaper'
import stylelint from 'stylelint'
import moment from 'moment'

import mustAuthenticate from '../../../shared/enforce-session'
import {expected} from '../../../shared/custom-errors'

const {LintError} = expected

export default async (root, {token, title, description, content, scope, version}, {Session, Theme, User}) => {
  await mustAuthenticate(token, Session)

  const session = await Session.findOne({
    token
  })

  const user = await User.findOne({
    '_id': session.user._id
  })

  const result = await stylelint.lint({
    'code':   content,
    'config': {
      'extends': 'stylelint-config-recommended-scss'
    }
  })

  if (result.results[0].errored) {
    throw new LintError(result.results[0].warnings)
  }

  const newTheme = Theme.create({
    'createdAt':   moment().toJSON(),
    'lastUpdate':  moment().toJSON(),
    'title':       escape(title),
    'description': escape(description),
    'user':        session.user,
    'version':     escape(version),
    content,
    scope
  })
  const savedTheme = await newTheme.save()

  user.themes.push(savedTheme)
  await user.save()

  return savedTheme
}
