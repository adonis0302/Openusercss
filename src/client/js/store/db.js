/* eslint no-console:0 */
import Loki from 'lokijs'
import {superstruct,} from 'superstruct'

const struct = superstruct({
  'types': {
    'any': () => true,
  },
})

const validators = {}

validators.option = struct({
  '__typename': 'string',
  'type':       'string',
  'label':      'string',
  'name':       'string',
  'value':      'any',
})
validators.themes = struct({
  'meta':        'object?',
  '$loki':       'number?',
  '__typename':  'string?',
  '_id':         'string',
  'title':       'string',
  'version':     'string',
  'content':     'string',
  'createdAt':   'string',
  'lastUpdate':  'string',
  'description': 'string',
  'user':        'string',
  'ratings':     struct.optional([
    'any',
  ]),
  'options': [
    validators.option,
  ],
  'screenshots': struct.optional([
    'string',
  ]),
}, {
  '__typename': 'Theme',
})
validators.users = struct({
  'meta':           'object?',
  '$loki':          'number?',
  '__typename':     'string?',
  '_id':            'string',
  'username':       'string',
  'displayname':    'string',
  'lastSeen':       'string',
  'lastSeenReason': 'string',
  'avatarUrl':      'string',
  'smallAvatarUrl': 'string',
  'bio':            'string',
  'donationUrl':    'string',
}, {
  '__typename': 'User',
})

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

  // Remove items from the db that don't fit the schema
  db.getCollection('themes').find().forEach((theme) => {
    try {
      validators.themes(theme)
    } catch (error) {
      console.warn(`Removing theme ${theme._id} from cache, because it failed validation - ${error}`)
      db.getCollection('themes').remove(theme)
    }
  })

  db.getCollection('users').find().forEach((user) => {
    try {
      validators.users(user)
    } catch (error) {
      console.warn(`Removing user ${user._id} from cache, because it failed validation - ${error}`)
      db.getCollection('users').remove(user)
    }
  })
}

if (process.browser) {
  const Adapter = Loki.persistenceAdapters.localStorage

  db = new Loki('ouc-db', {
    'adapter':          new Adapter(),
    'autoload':         true,
    'autoloadCallback': initialize,
    'autosave':         true,
    'autosaveInterval': 10000,
  })
} else {
  db = new Loki('ouc-db', {
    'autoload':         true,
    'autoloadCallback': initialize,
    'autosave':         false,
  })
}

if (!db.collections.length) {
  initialize()
}

export default db
export const upsert = (wantedCollection, object) => {
  const isCollection = !!wantedCollection.name
  const isString = typeof wantedCollection === 'string'

  if (!isCollection && !isString) {
    throw new Error(`Upsert must either be passed a string or a collection, got ${JSON.stringify(wantedCollection)} (${typeof wantedCollection})`)
  }
  let collection = null

  if (wantedCollection.name) {
    collection = db.getCollection(wantedCollection.name)
  } else if (typeof wantedCollection === 'string') {
    collection = db.getCollection(wantedCollection)
  } else {
    throw new Error('Colllection not found')
  }

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

  try {
    collection.update(item)
  } catch (err) {
    collection.findAndRemove({
      '_id': object._id,
    })
    collection.insert(item)
  }

  return object
}
