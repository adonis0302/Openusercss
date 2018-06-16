import log from 'chalk-console'
import camo, {connect,} from 'camo'
import {forOwn,} from 'lodash'
import staticConfig from '../../lib/config'

import Theme, {Option,} from './schema/theme'
import User from './schema/user'
import Session from './schema/session'
import Rating from './schema/rating'

const init = async () => {
  const config = await staticConfig()
  const connectionUrl = config.get('database.main')

  await connect(connectionUrl)
  log.info('API database connection established')
  log.info('Rebuiding indexes')
  const indexes = {
    'themes': [
      {
        'title':       'text',
        'description': 'text',
        'content':     'text',
      },
      {
        'weights': {
          'title':       11,
          'description': 4,
          'content':     1,
        },
      },
    ],
    'users': [
      {
        'displayname': 'text',
        'username':    'text',
        'bio':         'text',
      },
      {
        'weights': {
          'displayname': 5,
          'username':    3,
          'bio':         1,
        },
      },
    ],
  }

  forOwn(await camo.getClient().driver().collections(), (value) => {
    value.dropIndexes()
  })

  forOwn(indexes, (value, key) => {
    camo.getClient().driver().ensureIndex(key, value[0], value[1])
  })

  log.info('API database initialization completed')
}

const migrate = async (version) => {
  if (version === 'v1.4.2') {
    const ratings = await Rating.find({
      'user': null,
    })

    log.info(`Found ${ratings.length} malformed ratings`)
    const user = await User.findOne({
      '_id': '5a2f0361ba666f0b00b9c827',
    })

    if (!user) {
      log.warn('Could not find user, skipping migration')
      return false
    }

    log.info(`Found user ${user.username}`)
    const saves = []

    ratings.forEach((rating) => {
      rating.user = user
      saves.push(rating.save().then(() => {
        log.info(`Rating ${rating._id} saved`)
      }))
    })

    await Promise.all(saves)
  }
}

export default async () => {
  await init()

  if (process.env.MIGRATE_VERSION) {
    const migrationResult = await migrate(process.env.MIGRATE_VERSION)

    if (!migrationResult) {
      log.warn('Migration unsuccessful, continuing...')
    }
  }

  return {
    Theme,
    User,
    Session,
    Option,
    Rating,
  }
}
