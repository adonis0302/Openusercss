import moment from 'moment'

export default {
  'length': (max) => {
    return (data) => {
      return data.length <= max
    }
  },

  'regex': ({preset, validator}) => {
    let match = null

    switch (preset) {
    case 'email':
      // eslint-disable-next-line
      match = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
      break
    case 'jwt':
      // eslint-disable-next-line
      match = /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)/
      break
    case 'objectid':
      match = /^[a-f\d]{24}$/i
      break
    case 'regex':
      // eslint-disable-next-line
      match = /\/((?![*+?])(?:[^\r\n\[\/\\]|\\.|\[(?:[^\r\n\]\\]|\\.)*\])+)\/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)/
      break
    default:
      // eslint-disable-next-line
      match = /[]/
      break
    }

    if (validator) {
      return (data) => {
        return match.test(data)
      }
    }

    return match
  },

  'notLongerDate': (limit) => {
    return (requestedDate) => {
      const limitDate = moment().add(limit, 'days')
      const result = moment(limitDate).diff(requestedDate, 'days')

      return result >= 0 && result < limit
    }
  }
}
