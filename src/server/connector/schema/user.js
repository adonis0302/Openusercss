import {Document} from 'camo'
import moment from 'moment'

import Theme from './theme'
import validators from './validators'

export default class User extends Document {
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
        'validate': validators.length(254)
      },
      'emailVerified': {
        'type':     Boolean,
        'required': true,
        'default':  false
      },
      'password': {
        'type':     String,
        'required': true,
        'validate': validators.length(1024)
      },
      'lastSeen': {
        'type':     String,
        'required': false,
        'default':  moment().toJSON(),
        'validate': validators.isMomentJSON
      },
      'lastSeenReason': {
        'type':     String,
        'required': false,
        'default':  'registering',
        'validate': validators.length(64)
      },
      'themes': [
        Theme
      ]
    })
  }
}
