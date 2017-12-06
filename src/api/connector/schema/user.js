import {Document} from 'camo'
import moment from 'moment'
import gravatarUrl from 'gravatar-url'

import Theme from './theme'
import validators from './validators'

export default class User extends Document {
  preSave () {
    if (!this.createdAt) {
      this.createdAt = moment().toJSON()
    }
    this.lastUpdate = moment().toJSON()

    this.avatarUrl = gravatarUrl(this.email, {
      'size': 425
    })

    this.smallAvatarUrl = gravatarUrl(this.email, {
      'size': 15
    })
  }

  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': false,
        'validate': validators.isMomentJSON
      },
      'lastUpdate': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': false,
        'validate': validators.isMomentJSON
      },
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
      'avatarUrl': {
        'type': String
      },
      'smallAvatarUrl': {
        'type': String
      },
      'themes': [
        Theme
      ]
    })
  }
}
