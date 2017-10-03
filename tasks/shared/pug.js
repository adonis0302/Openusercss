const {clyConfig} = require('../appshell')
const pugGlob = require('pug-include-glob')

const pugOptions = {
  'data': {
    'clyConfig':   clyConfig.get(),
    'packagefile': require('../../package.json'),
    require
  },
  'ignoreErrors': true,
  'pretty':       false,
  'basedir':      './src',
  'plugins':      [
    pugGlob()
  ]
}

module.exports = {
  pugOptions
}
