import {Document} from 'camo'
import validators from './validators'

import Theme from './theme'

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
      'password': {
        'type':     String,
        'required': true
      },
      'themes': [
        Theme
      ]
    })
  }
}
