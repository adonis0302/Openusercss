/* eslint no-console:0 */
import Loki from 'lokijs'
import {superstruct,} from 'superstruct'
import {cloneDeep,} from 'lodash'

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
  db.collections.forEach((collection) => {
    const validate = validators[collection.name]

    collection.find().forEach((item) => {
      const itemClone = cloneDeep(item)

      Reflect.deleteProperty(itemClone, 'meta')
      Reflect.deleteProperty(itemClone, '$loki')

      try {
        validate(itemClone)
      } catch (error) {
        console.warn([
          `Removing ${itemClone.__typename} ${item._id} from cache, because it failed validation`,
          error,
        ].join('\n'))
        collection.remove(item)
      }
    })
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
    collection = wantedCollection
  } else if (typeof wantedCollection === 'string') {
    collection = db.getCollection(wantedCollection)
  } else {
    throw new Error('Colllection not found')
  }

  const validate = validators[collection.name]
  const item = validate(object)

  collection.findAndRemove({
    '_id': item._id,
  })
  collection.insert(item)

  return object
}
