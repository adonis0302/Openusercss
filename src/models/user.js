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

module.exports = {
  User,
  createUser
}
