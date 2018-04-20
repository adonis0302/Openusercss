import moment from 'moment'
import semver from 'semver'
import urlRegex from './url-regex'
import spdxList from '../../../lib/spdx-license-list'

export default {
  'spdxLicense': (value) => {
    if (value.toLowerCase() === 'other') {
      return true
    }

    return Boolean(spdxList[value])
  },

  'isOneOf': (array) => {
    return (data) => array.indexOf(data) !== -1
  },

  'length': (max) => {
    return (data) => {
      if (typeof data === 'undefined') {
        return false
      }

      return data.length <= max
    }
  },

  'urlEncoded': (value) => {
    const encoded = () => {
      const result = encodeURIComponent(value)

      return result === value
    }

    return encoded
  },

  'between': (...numbers) => {
    if (numbers.length !== 2) {
      throw new Error('"between" validator must be passed two arguments')
    }

    const [min, max,] = numbers

    if (min > max) {
      throw new Error('minimum value must be passed first')
    }

    return (value) => value >= min && value <= max
  },

  'regex': ({preset, validator, optional,}) => {
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
    case 'url':
      match = urlRegex
      break
    case 'ip':
      match = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/g
      break
    default:
      // eslint-disable-next-line
      match = /[]/
      break
    }

    if (validator) {
      return (data) => {
        if (optional && data === '') {
          return true
        }

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
  },

  'isMomentJSON': (json) => {
    const momentObject = moment(json)

    if (!momentObject.isValid()) {
      return false
    }

    return true
  },

  'isSemver': (version) => !!semver.valid(version),
}
