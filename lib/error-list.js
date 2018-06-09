import dashify from 'dashify'

// This is a list of known error code mappings that we can expect the API to send
// Errors are expected to use kebab-casing

const list = {
  sessionInvalid () {
    return 'Invalid session'
  },
  localsNoEmail () {
    return 'No e-mail option specified in e-mail template locals'
  },
  localsNoOldUserObject () {
    return 'No oldUser option specified in e-mail template locals'
  },
  cannotChangeToSameDisplayname () {
    return 'You can\'t change your username to the one you\'re already using'
  },
  cannotChangeToSameEmail () {
    return 'You can\'t change your e-mail address to the one you\'re already using'
  },
  noSuchTheme () {
    return 'No themes were found that match your query'
  },
  emailAlreadyVerified () {
    return 'This e-mail address is already verified'
  },
  emailNotVerified () {
    return 'You must verify your e-mail address before doing this'
  },
  emptyParseResult () {
    return 'Source parsing came up empty. Your CSS is probably invalid, please check with a linter'
  },
  verificationLinkTargetMismatch () {
    return 'This verification token verifies a different e-mail address. Please try again!'
  },
  noSuchUser () {
    return 'No users were found that match your query'
  },
  emailNotAccepted () {
    return 'We tried sending an e-mail, but it wasn\'t accepted by the receiving server'
  },
  credentialsInvalid () {
    return 'Invalid credentials'
  },
  cannotRateOwnTheme () {
    return 'You can\'t rate your own themes'
  },
}

export default (message) => {
  let translated = null

  Object.keys(list).forEach((key) => {
    if (dashify(key) === message) {
      translated = list[key]
    }
  })

  return translated
}
