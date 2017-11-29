// @flow
import express from 'express'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'
import staticConfig from '../shared/config'

import schema from './backend'
import connectMongo from './connector'
import brute from './brute'

import Theme from './connector/schema/theme'

const expressRouter = express.Router
const setupRoutes = async () => {
  const config = await staticConfig()
  const router = expressRouter()
  const context = await connectMongo()

  if (config.get('env') === 'development') {
    router.use('/graphiql', graphiqlExpress({
      'endpointURL': '/'
    }))
  }

  router.use('/theme/:id.user.css', brute.prevent, async (req, res, next) => {
    const foundTheme = await Theme.findOne({
      '_id': req.params.id
    })

    if (foundTheme) {
      let response = '/* ==userstyle==\n'

      response = `${response}@name ${foundTheme.title}\n`
      response = `${response}@description ${foundTheme.description}\n`
      response = `${response}@version ${foundTheme.version}\n`
      response = `${response}@namespace https://openusercss.org/theme/${foundTheme._id}\n`
      response = `${response}@homepageURL https://openusercss.org/theme/${foundTheme._id}\n`
      response = `${response}@author ${foundTheme.user.displayname} (https://openusercss.org/profile/${foundTheme.user._id})\n`
      response = `${response}==/userstyle== */\n`
      response = `${response}\n@-moz-document regexp("${foundTheme.scope}") {\n`
      response = `${response}${foundTheme.content.replace(/^/gm, '\t')}\n}\n`

      res.type('css')
      res.send(response)
    } else {
      res.type('json')
      res.send({
        'errors': [
          {
            'message': 'No theme found',
            'id':      req.params.id
          }
        ]
      })
    }
  })

  router.use('/', brute.prevent, bodyParser.json(), graphqlExpress({
    context,
    schema
  }))

  return router
}

export default setupRoutes
