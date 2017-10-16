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

const ourSassConfig = processObject(clyConfig.get(), (index, value) => {
  if (value[0] === '#') {
    return value
  } else if (
    value.includes
    && (value.includes('rem')
      || value.includes('em')
      || value.includes('px')
      || value.includes('%')
      || value.includes('vh')
      || value.includes('vw')
    )
  ) {
    return value
  }

  return `"${value}"`
})

const iconSizesPx = [
  32,
  128,
  512
]

const bgSizesPx = [
  1366,
  1920,
  360
]

const elementSizesPx = [
  640,
  960,
  1366,
  1920
]

const sizes = []

elementSizesPx.forEach((width) => {
  sizes.push({
    'suffix':  `x${width}`,
    'upscale': false,
    width
  })
})

const iconSizes = []

iconSizesPx.forEach((iconSize) => {
  iconSizes.push({
    'suffix':  `x${iconSize}`,
    'width':   iconSize,
    'upscale': false
  })
})

const bgSizes = []

bgSizesPx.forEach((bgSize) => {
  bgSizes.push({
    'suffix':  `x${bgSize}`,
    'width':   bgSize,
    'upscale': false
  })
})

module.exports = {
  clyConfig,
  options,
  myIp,
  processObject,
  ourSassConfig,
  iconSizes,
  bgSizes,
  sizes
}
