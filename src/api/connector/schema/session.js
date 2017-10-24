import {Document} from 'camo'
import moment from 'moment'
import validators from './validators'

import User from './user'

export default class Session extends Document {
  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     String,
        'required': true,
        'default':  moment().toJSON(),
        'validate': validators.isMomentJSON
      },
      'expiresAt': {
        'type':     String,
        'required': true,
        'default':  moment().add(60, 'days').toJSON(),
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
