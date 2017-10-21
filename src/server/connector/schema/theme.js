import {Document} from 'camo'
import validators from './validators'

import User from './user'

export default class Theme extends Document {
  preSave () {
    this.lastUpdate = Date.now()
  }

  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     Date,
        'default':  Date.now(),
        'required': true
      },
      'lastUpdate': {
        'type':     Date,
        'default':  Date.now(),
        'required': true
      },
      'title': {
        'type':     String,
        'validate': validators.length(64),
        'required': true
      },
      'description': {
        'type':     String,
        'validate': validators.length(256),
        'required': true
      },
      'content': {
        'type':     String,
        'validate': validators.length(102400),
        'required': true
      },
      'scope': {
        'type':     String,
        'required': true,
        'match':    validators.regex({
          'preset':    'regex',
          'validator': false
        }),
        'validate': validators.length(128)
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
