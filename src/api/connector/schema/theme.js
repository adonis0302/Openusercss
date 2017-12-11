import {Document, EmbeddedDocument} from 'camo'
import moment from 'moment'
import {findIndex} from 'lodash'

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
        'validate': validators.length(256),
        'required': true,
        'default':  ''
      },
      'large': {
        'type':  String,
        'match': validators.regex({
          'preset':    'url',
          'validator': false
        }),
        'validate': validators.length(256),
        'required': true,
        'default':  ''
      }
    })
  }
}

export default class Theme extends Document {
  preSave () {
    if (!this.createdAt) {
      this.createdAt = moment().toJSON()
    }
    this.lastUpdate = moment().toJSON()
  }

  async preDelete () {
    const user = await User.findOne({
      '_id': this.user._id
    })

    user.themes.forEach((theme, index) => {
      if (!theme) {
        user.themes.splice(index, 1)
      }
    })

    const themeIndex = findIndex(user.themes, (item) => {
      let result = false

      if (item) {
        result = item._id.equals(this._id)
      }

      return result
    })

    user.themes.splice(themeIndex, 1)
    return user.save()
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
        'validate': (value) => validators.length(102400)(value) && validators.urlEncoded(value),
        'required': true
      },
      'version': {
        'type':     String,
        'required': true,
        'validate': validators.isSemver
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
