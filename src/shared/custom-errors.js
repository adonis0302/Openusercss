export class ExpectedError extends Error {
  constructor ({
    prefix,
    message,
  }) {
    let msg = message

    if (message instanceof Object) {
      msg = JSON.stringify(msg, null, 4)
    }

    const prefixRe = new RegExp(prefix, 'g')
    const gqlRe = new RegExp('GraphQL error\: ', 'g')

    let preparedMsg = ''

    preparedMsg = msg.replace(prefixRe, '')
    preparedMsg = msg.replace(gqlRe, '')

    if (prefix) {
      preparedMsg = `${prefix}: ${preparedMsg}`
    }

    super(preparedMsg)
  }
}

export class ServerError extends ExpectedError {
  constructor ({
    prefix,
    message,
  }) {
    let msg = message

    if (message instanceof Object) {
      msg = JSON.stringify(msg, null, 4)
    }

    super({
      'prefix':  'Server error',
      'message': msg,
    })
  }
}

class AuthenticationError extends ExpectedError {
  constructor (message, status) {
    super({
      'prefix': 'Authentication error',
      message,
    })
  }
}

class LintError extends ExpectedError {
  constructor (message, status) {
    super({
      'prefix': 'Linting error',
      message,
    })
  }
}

export const expected = {
  AuthenticationError,
  LintError,
}
