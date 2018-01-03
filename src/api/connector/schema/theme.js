import {Document, EmbeddedDocument} from 'camo'
import moment from 'moment'
import {findIndex} from 'lodash'

import validators from './validators'
import User from './user'

export class Option extends EmbeddedDocument {
  constructor () {
    super()

    this.schema({
      'type': {
        'type':     String,
        'required': true,
        'validate': validators.isOneOf([
          'text',
          'color',
          'dropdown',
          'checkbox'
        ])
      },
      'title': {
        'type':     String,
        'required': true,
        'validate': validators.length(64)
      },
      'varname': {
        'type':     String,
        'required': true,
        'validate': validators.length(64)
      },
      'default': {
        'type':     String,
        'required': true,
        'validate': validators.length(64)
      },
      'possibleValues': {
        'type': [
          String
        ],
        'required': false,
        'default':  [],
        'validate': validators.length(64)
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

    this.rating = 0
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
        'validate': validators.length(2048),
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
      'screenshots': {
        'type': [
          String
        ],
        'required': false,
        'validate': validators.length(10)
      },
      'options': {
        'type':     Array,
        'required': false,
        'default':  [],
        'validate': validators.length(64)
      },
      'user': User
    })
  }
}
