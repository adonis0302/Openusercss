// @flow

import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID
} from 'graphql'

import userType from './type'
import {User} from './index'

export default {
  'register': {
    'type': userType,
    'args': {
      'username': {
        'name': 'name',
        'type': new GraphQLNonNull(GraphQLString)
      },
      'email': {
        'name': 'email',
        'type': new GraphQLNonNull(GraphQLString)
      },
      'password': {
        'name': 'password',
        'type': new GraphQLNonNull(GraphQLString)
      }
    },
    'resolve': User.register
  },
  'updateUser': {
    'type': userType,
    'args': {
      'id': {
        'type': GraphQLID
      },
      'username': {
        'name': 'name',
        'type': new GraphQLNonNull(GraphQLString)
      },
      'email': {
        'name': 'email',
        'type': new GraphQLNonNull(GraphQLString)
      }
    },
    'resolve': User.updateUser
  }
}
