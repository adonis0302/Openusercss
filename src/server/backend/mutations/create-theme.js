import mustAuthenticate from '../../shared/enforce-session'
import {escape} from 'html-escaper'
import stylelint from 'stylelint'
import {expected} from '../../shared/custom-errors'

const {LintError} = expected

export default async (root, {token, title, description, content, scope}, {Session, Theme, User}) => {
  await mustAuthenticate(token, Session)

  const session = await Session.findOne({
    token
  })

  const result = await stylelint.lint({
    'code':   content,
    'config': {
      'extends': 'stylelint-config-recommended'
    }
  })

  if (result.results[0].errored) {
    throw new LintError(result.results[0].warnings)
  }

  const newTheme = Theme.create({
    'createdAt':   Date.now(),
    'lastUpdate':  Date.now(),
    'title':       escape(title),
    'description': escape(description),
    'user':        session.user,
    content,
    scope
  })

  return newTheme.save()
}
