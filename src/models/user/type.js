// @flow

import createType from 'mongoose-schema-to-graphql'
import {User} from './index'

const config = {
  'name':        'User',
  'description': 'The User model',
  'class':       'GraphQLObjectType',
  'schema':      User.schema,
  'exclude':     [
    '_id',
    '__v',
    'apikey',
    'password'
  ]
}

export default createType(config)
