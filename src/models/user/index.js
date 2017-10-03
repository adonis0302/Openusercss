// @flow

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import {handle} from '../../utils/error-handler'
import uniqueValidator from 'mongoose-unique-validator'
// import log from 'chalk-console'

const {Schema} = mongoose

const UserSchema = new Schema({
  'username': {
    'type':   String,
    'index':  true,
    'unique': true
  },
  'displayname': {
    'type':   String,
    'index':  true,
    'unique': true
  },
  'password': {
    'type': String
  },
  'email': {
    'type':   String,
    'unique': true
  },
  'apikey': {
    'type':   String,
    'unique': true
  }
})

UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema)

const createUser = async (newUser) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newUser.password, salt)

  newUser.username = newUser.displayname.toLowerCase()
  newUser.password = hash
  return newUser.save()
}

const getUserByEmail = async (root, {email}: String) => {
  const query = {email}
  let foundUser = null

  try {
    foundUser = User.findOne(query)
  } catch (error) {
    handle(error)
  }

  return foundUser
}

const getUserById = async (root, {id}: String) => {
  return User.findById(id)
}

const getUserByUsername = async (root, {username}: String) => {
  return User.findOne({username})
}

const comparePassword = async (candidatePassword: String, hash: String) => {
  const isMatch = await bcrypt.compare(candidatePassword, hash)

  return isMatch
}

const getListOfUsers = async () => {
  const foundUsers = await User.find({})

  return foundUsers
}

module.exports = {
  comparePassword,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getListOfUsers,
  createUser,
  User
}
