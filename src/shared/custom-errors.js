class AuthenticationError extends Error {
  constructor (message, status) {
    super(`Authentication error: ${message}`)
    this.name = this.constructor.name
    this.stack = null

    this.status = 'Authentication failed'
  }
}

class ImplementationError extends Error {
  constructor (message, status) {
    super(`Implementation error: ${message}`)
    this.name = this.constructor.name
    this.stack = null

    this.status = 'Implementation error'
  }
}

export const expected = {
  AuthenticationError,
  ImplementationError
}
