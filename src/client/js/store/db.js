import Loki from 'lokijs'
import {defaultsDeep} from 'lodash'
import {struct} from 'superstruct'

let db = null
const initialize = () => {
  if (!db) {
    throw new Error('The database does not exist')
  }

  if (!db.getCollection('users')) {
    db.addCollection('users')
  }
  if (!db.getCollection('themes')) {
    db.addCollection('themes')
  }
}

if (process.browser) {
  const Adapter = Loki.persistenceAdapters.localStorage

  db = new Loki('ouc-db', {
    'adapter':          new Adapter(),
    'autoload':         true,
    'autoloadCallback': initialize,
    'autosave':         true,
    'autosaveInterval': 10000
  })
} else {
  db = new Loki('ouc-db', {
    'autoload':         true,
    'autoloadCallback': initialize,
    'autosave':         false
  })
}

const validators = {}

validators.reference = (typename) => {
  if (!typename || typeof typename !== 'string') {
    throw new Error(`typename argument must be a string, got ${typeof typename}: ${JSON.stringify(typename)}`)
  }

  return struct({
    '__typename': 'string',
    '_id':        'string'
  }, {
    '__typename': typename
  })
}
validators.themes = struct({
  '__typename':  'string?',
  '_id':         'string',
  'title':       'string?',
  'version':     'string?',
  'content':     'string?',
  'createdAt':   'string?',
  'lastUpdate':  'string?',
  'rating':      'number?',
  'description': 'string?',
  'screenshots': struct.optional([
    'string'
  ]),
  'user': validators.reference('User')
}, {
  '__typename': 'Theme'
})
validators.users = struct({
  '__typename':     'string?',
  '_id':            'string',
  'username':       'string?',
  'displayname':    'string?',
  'lastSeen':       'string?',
  'lastSeenReason': 'string?',
  'avatarUrl':      'string?',
  'smallAvatarUrl': 'string?',
  'themes':         struct.optional([
    validators.reference('Theme')
  ])
}, {
  '__typename': 'User'
})

if (!db.collections.length) {
  initialize()
}

export default db
export const upsert = (collection, object) => {
  const validate = validators[collection.name]
  let item = null

  try {
    item = validate(object)
  } catch (error) {
    if (object instanceof Array) {
      throw new Error('upsert item must not be an array')
    }

    throw error
  }

  item = collection.findOne({
    '_id': item._id
  })

  if (item) {
    item = defaultsDeep(object, item)
    collection.update(item)
  } else {
    collection.insert(object)
  }

  return object
}
export const createBogusDB = () => new Loki('ouc-request-db', {
  'autoload':         true,
  'autoloadCallback': initialize,
  'autosave':         false
})
