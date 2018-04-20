const helmet = require('helmet')

if (process.env.NODE_ENV === 'production') {
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
        'pwk.decentm.com',
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
        'pwk.decentm.com',
        'gravatar.com',
        'sentry.io',
      ],
      'fontSrc': [
        'data:',
        "'self'",
      ],
      'workerSrc': [
        "'self'",
        'blob:',
      ],
    },
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
}
