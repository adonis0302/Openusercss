import test from 'ava'
import hat from 'hat'
import {connect,} from 'camo'

import User from '../../api/connector/schema/user'
import {sync as staticConfig,} from '../../lib/config'

const config = staticConfig()
const connectionUrl = 'mongodb://localhost:27017/opnusercss-main'
const username = `testuser-${hat(64)}`

export const apiURL = 'http://api.dev.openusercss.local/'
export const context = {
  'password': hat(64),
  'email':    `${username}@openusercss.org`,
  username,
  config,
  connectionUrl,
}

test.before('prepare connection to database', async (t) => {
  await connect(connectionUrl)
})

test.after.always('cleanup test account and themes', async (t) => {
  const testUser = await User.findOne({
    'username': context.username,
  })

  if (testUser) {
    return testUser.delete()
  }

  return true
})

export default test
