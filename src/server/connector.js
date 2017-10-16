import {MongoClient} from 'mongodb'
import {handle} from './shared/error-handler'
import log from 'chalk-console'

const connectionUrl = 'mongodb://localhost:27017/openusercss'

export default async () => {
  let db = null

  try {
    db = await MongoClient.connect(connectionUrl)
    log.info('Database connection established')
  } catch (error) {
    handle(error)
  }

  return {
    'Users':  db.collection('users'),
    'Logins': db.collection('logins'),
    'Themes': db.collection('themes')
  }
}
