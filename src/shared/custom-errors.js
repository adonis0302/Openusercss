export class AuthenticationError extends Error {
  constructor (message, status) {
    super(`Authentication error: ${message}`)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)

    this.status = 'Authentication failed'
  }
}

export class ImplementationError extends Error {
  constructor (message, status) {
    super(`Implementation error: ${message}`)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)

    this.status = 'Implementation error'
  }
}
