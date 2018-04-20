import cors from 'cors'

export default async ({app, config,}) => {
  const origin = [
    'https://openusercss.org',
    'https://openusercss.com',
  ]

  if (process.env.NODE_ENV === 'development') {
    origin.push('http://dev.openusercss.local')
  }

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
