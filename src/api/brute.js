import ExpressBrute from 'express-brute'
import BruteMongo from 'express-brute-mongo'
import {MongoClient} from 'mongodb'
import staticConfig from '../shared/config'

const {connect} = MongoClient
const store = new BruteMongo(async (ready) => {
  const config = await staticConfig()

  connect(config.get('database.brute'), (error, db) => {
    if (error) {
      throw error
    }

    ready(db.collection('brute-store'))
  })
})

export default new ExpressBrute(store, {
  'freeRetries':             1,
  'attachResetToRequest':    false,
  'refreshTimeoutOnRequest': false,
  'minWait':                 1000,
  'maxWait':                 1000,
  'lifetime':                1
})
