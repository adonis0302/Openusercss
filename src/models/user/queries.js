// @flow

import {
  GraphQLString,
  GraphQLList,
  GraphQLID
} from 'graphql'

import userType from './type'
import User from './index'

const queries = {}

queries.userByEmail = {
  'type': userType,
  'args': {
    'email': {
      'type': GraphQLString
    }
  },
  'resolve': User.getUserByEmail
}

queries.userByUsername = {
  'type': userType,
  'args': {
    'username': {
      'type': GraphQLString
    }
  },
  'resolve': User.getUserByUsername
}

queries.userId = {
  'type': userType,
  'args': {
    'id': {
      'type': GraphQLID
    }
  },
  'resolve': User.getUserById
}

queries.user = {
  'type': userType,
  'args': {
    'id': {
      'type': GraphQLID
    }
  },
  'resolve': User.getUserByPosition
}

queries.users = {
  'type':    new GraphQLList(userType),
  'resolve': User.getListOfUsers
}

module.exports = queries
