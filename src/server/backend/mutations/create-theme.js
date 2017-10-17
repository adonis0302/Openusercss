import mustAuthenticate from '../../shared/enforce-session'
import {escape} from 'html-escaper'
import stylelint from 'stylelint'
import {ImplementationError} from '../../shared/custom-errors'
import log from 'chalk-console'

export default async (root, {token, title, description, content}, {Session, Theme, User}) => {
  await mustAuthenticate(token, Session)

  const session = await Session.findOne({
    token
  })

  const result = await stylelint.lint({
    'code':   content,
    'config': {
      'extends': 'stylelint-config-standard'
    }
  })

  if (result.results[0].errored) {
    log.info(`Warnings: ${JSON.stringify(result.results[0].warnings, null, 4)}`)
    throw new ImplementationError('CSS lint failed')
  }

  const newTheme = Theme.create({
    'createdAt':   Date.now(),
    'lastUpdate':  Date.now(),
    'title':       escape(title),
    'description': escape(description),
    'user':        session.user,
    content
  })

  return newTheme.save()
}
