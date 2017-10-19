class ExpectedError {
  constructor ({prefix, message}) {
    this.message = message.replace('GraphQL error: ', '')
    this.stack = null
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
      message
    })
  }
}

export const expected = {
  AuthenticationError,
  LintError
}
