import cors from 'cors'

export default async ({app, config,}) => {
  const origin = [
    'https://openusercss.org',
    'https://openusercss.com',
  ]

  if (process.env.NODE_ENV === 'development') {
    origin.push('http://localhost:5010')
  }

  app.use(cors({
    origin,
    'methods': [
      'POST',
    ],
  }))
}
