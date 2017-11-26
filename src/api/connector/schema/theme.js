import {Document, EmbeddedDocument} from 'camo'
import moment from 'moment'

import validators from './validators'
import User from './user'

class Screenshot extends EmbeddedDocument {
  constructor () {
    super()

    this.schema({
      'small': {
        'type':  String,
        'match': validators.regex({
          'preset':    'url',
          'validator': false
        }),
        'required': true,
        'default':  ''
      },
      'large': {
        'type':  String,
        'match': validators.regex({
          'preset':    'url',
          'validator': false
        }),
        'required': true,
        'default':  ''
      }
    })
  }
}

export default class Theme extends Document {
  preSave () {
    this.lastUpdate = moment().toJSON()
  }

  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': true,
        'validate': validators.isMomentJSON
      },
      'lastUpdate': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': true,
        'validate': validators.isMomentJSON
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
      'screenshots': [
        Screenshot
      ],
      'user': User
    })
  }
}
