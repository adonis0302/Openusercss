import cors from 'cors'

export default async ({app, config,}) => {
  const origin = [
    'https://openusercss.org',
    'https://openusercss.com',
    'https://staging.openusercss.org',
    'https://staging.openusercss.com',
  ]

  if (process.env.NODE_ENV === 'development') {
    origin.push(`http://${config.get('domain')}`)
  }

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
