import secure from 'lib/express/secure'
import routes from 'lib/express/api-routes'
import cors from 'lib/express/cors'

export const handler = async ({app, config, mode,}) => {
  await secure({app, config, mode,})
  await cors({app, config, mode,})
  await routes({app, config, mode,})

  return {app,}
}
