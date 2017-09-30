import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
// import pify from 'pify'
// import log from 'chalk-console'
import {handle} from '../utils/error-handler'
import uniqueValidator from 'mongoose-unique-validator'

const {Schema} = mongoose

const UserSchema = new Schema({
  'username': {
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
  }
})

UserSchema.plugin(uniqueValidator)

const User = mongoose.model('User', UserSchema)

const createUser = async (newUser) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newUser.password, salt)

  newUser.password = hash
  return newUser.save()

  /* bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      throw error
    }
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) {
        throw err
      }

      newUser.password = hash
      newUser.save(callback)
    })
  }) */
}

const getUserByEmail = async (email) => {
  const query = {email}
  let foundUser = null

  try {
    foundUser = User.findOne(query)
  } catch (error) {
    handle(error)
  }

  return foundUser
}

const getUserById = async (id, callback) => {
  return User.findById(id, callback)
}

const comparePassword = async (candidatePassword, hash) => {
  const isMatch = await bcrypt.compare(candidatePassword, hash)

  return isMatch
}

module.exports = {
  comparePassword,
  getUserById,
  getUserByEmail,
  createUser,
  User
}
