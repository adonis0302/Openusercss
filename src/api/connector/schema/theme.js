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
    const themeIndex = findIndex(user.themes, {
      '_id': this._id
    })

    user.themes.pop(themeIndex, 1)
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
        'validate': validators.length(102400),
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
