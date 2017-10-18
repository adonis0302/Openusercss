// import {MongoClient} from 'mongodb'
import log from 'chalk-console'
import {Document, connect} from 'camo'
import moment from 'moment'

const connectionUrl = 'mongodb://localhost:27017/openusercss'

const validators = {
  'length': (max) => {
    return (data) => {
      return data.length <= max
    }
  },

  'regex': ({preset, validator}) => {
    let match = null

    switch (preset) {
    case 'email':
      // eslint-disable-next-line
      match = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      break
    case 'jwt':
      // eslint-disable-next-line
      match = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/
      break
    case 'objectid':
      match = /^[a-f\d]{24}$/i
      break
    default:
      // eslint-disable-next-line
      match = /[]/
      break
    }

    if (validator) {
      return (data) => {
        return match.test(data)
      }
    }

    return match
  },

  'notLongerDate': (limit) => {
    return (requestedDate) => {
      const limitDate = moment().add(limit, 'days')
      const result = moment(limitDate).diff(requestedDate, 'days')

      return result >= 0 && result < limit
    }
  }
}

class User extends Document {
  constructor () {
    super()

    this.schema({
      'displayname': {
        'type':     String,
        'unique':   true,
        'required': true,
        'validate': validators.length(32)
      },
      'username': {
        'type':     String,
        'unique':   true,
        'required': true,
        'validate': validators.length(32)
      },
      'email': {
        'type':     String,
        'unique':   true,
        'required': true,
        'match':    validators.regex({
          'preset':    'email',
          'validator': false
        }),
        'validate': validators.length(255)
      },
      'password': {
        'type':     String,
        'required': true
      }
    })
  }
}

class Theme extends Document {
  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     Date,
        'default':  Date.parse(moment()),
        'required': true
      },
      'lastUpdate': {
        'type':     Date,
        'default':  Date.parse(moment()),
        'required': true
      },
      'title': {
        'type':     String,
        'validate': validators.length(64),
        'required': true
      },
      'description': {
        'type':     String,
        'validate': validators.length(255),
        'required': true
      },
      'content': {
        'type':     String,
        'validate': validators.length(102400),
        'required': true
      },
      'rating': {
        'type':    Number,
        'min':     0,
        'max':     5,
        'default': 0
      },
      'user': User
    })
  }
}

class Session extends Document {
  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     Date,
        'required': true,
        'default':  Date.parse(moment())
      },
      'expiresAt': {
        'type':     Date,
        'required': true,
        'default':  Date.parse(moment().add(60, 'days')),
        'validate': validators.notLongerDate(60)
      },
      'token': {
        'type':     String,
        'required': true,
        'unique':   true,
        'valiade':  validators.regex('jwt')
      },
      'user': User
    })
  }
}

(async () => {
  await connect(connectionUrl)
  log.info('Database connection established')
})()

export default async () => {
  return {
    Theme,
    User,
    Session
  }
}
