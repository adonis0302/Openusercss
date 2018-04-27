import helmet from 'helmet'

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
}
