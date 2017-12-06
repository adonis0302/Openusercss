export class ExpectedError extends Error {
  constructor ({prefix, message}) {
    let msg = message

    if (message instanceof Object) {
      msg = JSON.stringify(msg, null, 4)
    }

    const prefixRe = new RegExp(prefix, 'g')
    const gqlRe = new RegExp('GraphQL error\: ', 'g')

    let preparedMsg = ''

    preparedMsg = msg.replace(prefixRe, '')
    preparedMsg = msg.replace(gqlRe, '')

    super(preparedMsg)
  }
}

class AuthenticationError extends ExpectedError {
  constructor (message, status) {
    super({
      'prefix': 'Authentication error',
      message
    })
  }
}

class LintError extends ExpectedError {
  constructor (message, status) {
    super({
      'prefix': 'Linting error',
      message
    })
  }
}

export const expected = {
  AuthenticationError,
  LintError
}
