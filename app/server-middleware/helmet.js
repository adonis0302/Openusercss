const helmet = require('helmet')

const cspOptions = {
  'directives': {
    'defaultSrc': [
      "'self'",
      'openusercss.org',
      'openusercss.com',
    ],
    'scriptSrc': [
      "'self'",
      'openusercss.org',
      'openusercss.com',
      'sentry.io',
    ],
    'styleSrc': [
      "'self'",
      "'unsafe-inline'",
      'openusercss.org',
      'openusercss.com',
    ],
    'imgSrc': [
      "'self'",
      'data:',
      'imageproxy.openusercss.org',
      'imageproxy.openusercss.com',
      'gravatar.com',
    ],
    'connectSrc': [
      'openusercss.org',
      'openusercss.com',
      'api.openusercss.org',
      'api.openusercss.com',
      'imageproxy.openusercss.org',
      'imageproxy.openusercss.com',
      'gravatar.com',
      'sentry.io',
    ],
    'fontSrc': [
      'data:',
      "'self'",
    ],
  },
}

if (process.env.NODE_ENV === 'development') {
  cspOptions.directives.defaultSrc.push('localhost')
  cspOptions.directives.imgSrc.push('localhost')
  cspOptions.directives.connectSrc.push('localhost:*')
  cspOptions.directives.connectSrc.push('ws://localhost:*')
  cspOptions.directives.scriptSrc = [
    ...cspOptions.directives.scriptSrc,
    "'unsafe-inline'",
    "'unsafe-eval'",
  ]
}

module.exports = helmet({
  'contentSecurityPolicy': cspOptions,
  'dnsPrefetchControl':    {
    'allow': true,
  },
  'frameguard': {
    'action': 'deny',
  },
  'hsts': {
    'maxAge': 60 * 60 * 24 * 60,
  },
  'referrerPolicy': {
    'policy': 'strict-origin-when-cross-origin',
  },
})
