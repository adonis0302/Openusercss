/* eslint no-invalid-this:0 no-underscore-dangle:0 */

const Conf = require('conf')
const clyConfig = new Conf({
  'cwd':        '.',
  'configName': 'config'
})
const options = {}

// IP ADDRESSES
// Get the most remote IP address on interfaces for browserSync
const os = require('os')
const first = require('lodash').first
const address = require('address')
const ips = []
const ifaces = os.networkInterfaces()

for (const dev in os.networkInterfaces()) {
  if (Object.prototype.hasOwnProperty.call(ifaces, dev)) {
    ips.splice(0, 0, address.ip(dev))
  }
}

const myIp = first(ips)

Object.freeze(options)

const processObject = (object, func) => {
  for (const index in object) {
    if (typeof object[index] === 'object') {
      object[index] = processObject(object[index], func)
    } else {
      object[index] = func(index, object[index])
    }
  }

  return object
}

module.exports = {
  clyConfig,
  options,
  myIp,
  processObject
}
