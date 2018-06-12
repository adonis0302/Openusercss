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
  if (version === 'v1.0.0') {
    log.info('Starting database migration')
    const themes = await Theme.find()
    const modifies = []
    const decentm = await User.find({
      'username': 'decentm',
    })

    themes.forEach((theme) => {
      log.info(`Migrating ${theme._id} (${theme.title})`)

      if (theme.rating) {
        log.info(`Migrating rating ${theme.rating}`)
        const newRating = Rating.create({
          'value': theme.rating,
          'user':  decentm,
          theme,
        })

        modifies.push(newRating.save().then(() => log.info(`Rating migrated: ${theme.rating}`)))
      }

      theme.license = theme.license || 'Other'
      Reflect.deleteProperty(theme, 'rating')

      modifies.push(theme.save().then(() => log.info(`Migrated ${theme._id} (${theme.title})`)))
    })

    return Promise.all(modifies).then(() => {
      log.info('Database migration complete')
    })
  }
}

export default async () => {
  await init()
  await migrate(process.env.MIGRATE_VERSION)

  return {
    Theme,
    User,
    Session,
    Option,
    Rating,
  }
}
