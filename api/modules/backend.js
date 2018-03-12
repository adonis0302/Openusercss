import schema from '../backend'
import connectMongo from '../connector'

const connection = connectMongo()

export default (req, res, next) => {
  return connection.then((db) => ({
    'context': {
      'token': req.headers.authorization,
      ...req,
      ...db,
    },
    schema,
  }))
}
