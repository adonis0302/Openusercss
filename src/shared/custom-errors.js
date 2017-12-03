export class ExpectedError {
  constructor ({prefix, message}) {
    this.message = message

    if (typeof message === 'object') {
      this.message = JSON.stringify(message)
    }

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
      'prefix': 'Linting error',
      message
    })
  }
}

export const expected = {
  AuthenticationError,
  LintError
}
