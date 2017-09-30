const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// User Schema
const UserSchema = mongoose.Schema({
  'username': {
    'type':  String,
    'index': true
  },
  'password': {
    'type': String
  },
  'email': {
    'type': String
  }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = (newUser, callback) => {
  bcrypt.genSalt(10, (error, salt) => {
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
  })
}

module.exports.getUserByEmail = (email, callback) => {
  const query = {email}

  User.findOne(query, callback)
}

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback)
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) {
      throw err
    }
    callback(null, isMatch)
  })
}
