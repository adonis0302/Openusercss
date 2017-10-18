class ExpectedError {
  constructor ({prefix, message}) {
    /* if (prefix) {
      super(`${prefix}: ${JSON.stringify(message)}`)
    } else {
      super(message)
    } */

    this.message = message
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
