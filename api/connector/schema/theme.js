import {Document, EmbeddedDocument,} from 'camo'
import moment from 'moment'

import validators from './validators'
import User from './user'

export class VariableOption extends EmbeddedDocument {
  constructor () {
    super()

    this.schema({
      'name': {
        'type':     String,
        'required': false,
        'validate': validators.length(64),
      },
      'label': {
        'type':     String,
        'required': false,
        'validate': validators.length(64),
      },
      'value': {
        'type':     String,
        'required': false,
        'validate': validators.length(64),
      },
    })
  }
}

export class Variable extends EmbeddedDocument {
  constructor () {
    super()

    this.schema({
      'type': {
        'type':     String,
        'required': true,
        'validate': validators.isOneOf([
          'text',
          'color',
          'select',
          'checkbox',
        ]),
      },
      'label': {
        'type':     String,
        'required': true,
        'validate': validators.length(64),
      },
      'name': {
        'type':     String,
        'required': true,
        'validate': validators.length(64),
      },
      'value': {
        'type':     String,
        'required': false,
        'validate': validators.length(64),
      },
      'default': {
        'type':     String,
        'required': false,
        'validate': validators.length(64),
      },
      'options': {
        'type':     [ VariableOption, ],
        'required': false,
      },
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

  constructor () {
    super()

    this.schema({
      'createdAt': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': false,
        'validate': validators.isMomentJSON,
      },
      'lastUpdate': {
        'type':     String,
        'default':  moment().toJSON(),
        'required': false,
        'validate': validators.isMomentJSON,
      },
      'title': {
        'type':     String,
        'validate': validators.length(64),
        'required': true,
      },
      'description': {
        'type':     String,
        'validate': validators.length(2048),
        'required': true,
      },
      'content': {
        'type':     String,
        'validate': (value) => validators.length(102400)(value) && validators.urlEncoded(value),
        'required': true,
      },
      'version': {
        'type':     String,
        'required': true,
        'validate': validators.isSemver,
      },
      'license': {
        'type':     String,
        'required': true,
        'validate': validators.spdxLicense,
      },
      'screenshots': {
        'type': [
          String,
        ],
        'required': false,
        'validate': validators.length(10),
      },
      'variables': {
        'type':     [ Variable, ],
        'required': false,
        'default':  [],
      },
      'user': User,
    })
  }
}
