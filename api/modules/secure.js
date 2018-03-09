import helmet from 'helmet'
import corser from 'corser'

export default async ({app, config,}) => {
  const cspOptions = {
    'directives': {
      'defaultSrc': [
        "'self'",
      ],
    },
  }

  if (config.get('env') === 'development') {
    cspOptions.directives.defaultSrc.push('localhost')
    cspOptions.directives.scriptSrc = [
      ...cspOptions.directives.defaultSrc,
      "'unsafe-inline'",
      'unpkg.com',
      'cdn.jsdelivr.net',
    ]
    cspOptions.directives.styleSrc = [
      ...cspOptions.directives.defaultSrc,
      "'unsafe-inline'",
      'unpkg.com',
    ]
  }

  app.use(helmet({
    'contentSecurityPolicy': cspOptions,
    'dnsPrefetchControl':    {
      'allow': false,
    },
    'frameguard': {
      'action': 'deny',
    },
    'hsts': {
      'maxAge': 60 * 60 * 24 * 60,
    },
    'referrerPolicy': {
      'policy': 'no-referrer',
    },
  }))

  app.use(corser.create())
}
