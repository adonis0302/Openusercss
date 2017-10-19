import {Document} from 'camo'
import moment from 'moment'
import validators from './validators'

import User from './user'

export default class Session extends Document {
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
