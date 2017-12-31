import {Document} from 'camo'
import moment from 'moment'

import validators from './validators'
import User from './user'
import Theme from './theme'

export default class Rating extends Document {
  async preSave () {
    if (!this.createdAt) {
      this.createdAt = moment().toJSON()
    }
    this.lastUpdate = moment().toJSON()
  }

  constructor () {
    super()

    this.schema({
      'user':  User,
      'theme': Theme,
      'value': {
        'type':     Number,
        'required': false,
        'default':  0,
        'validate': validators.between(1, 5)
      },
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
      }
    })
  }
}
