import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import pify from 'pify'

const {Schema} = mongoose

const UserSchema = new Schema({
  'username': {
    'type':   String,
    'unique': true
  },
  'password': {
    'type': String
  },
  'email': {
    'type':   String,
    'index':  true,
    'unique': true
  },
  'name': {
    'type': String
  }
})

const User = mongoose.model('User', UserSchema)

const createUser = async (newUser) => {
  const salt = await pify(bcrypt.genSalt)(10)
  const hash = await pify(bcrypt.hash)(newUser.password, salt)

  newUser.password = hash
  return newUser.save()
}

const getUserByEmail = (address) => {
  const query = {
    'email': address
  }

  return User.findOne(query)
}

const getUserById = (id) => {
  const query = {
    id
  }

  return User.findOne(query)
}

const comparePassword = (candidate, hash, callback) => {
  bcrypt.compare(candidate, hash, (error, isMatch) => {
    if (error) {
      throw error
    }

    callback(null, isMatch)
  })
}

module.exports = {
  User,
  createUser,
  getUserByEmail,
  getUserById,
  comparePassword
}
