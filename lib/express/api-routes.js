import {graphqlExpress, graphiqlExpress,} from 'apollo-server-express'
import bodyParser from 'body-parser'

import usercsssRenderer from './usercss-renderer'
import backend from './backend'

export default async ({app, config,}) => {
  if (config.get('env') === 'development') {
    app.use('/graphiql', graphiqlExpress({
      'endpointURL': '/',
    }))
  }

  app.use('/theme/:id.user.css', usercsssRenderer)

  app.use('/', bodyParser.json({
    'limit': 120000,
  }), graphqlExpress(backend))
}
