import {appConfig,} from './config'
import pugGlob from 'pug-include-glob'

const pugOptions = {
  'data': {
    'appConfig':   appConfig.get(),
    'packagefile': require('../../package.json'),
    require,
  },
  'ignoreErrors': true,
  'pretty':       false,
  'basedir':      './src',
  'plugins':      [
    pugGlob(),
  ],
}

export {
  pugOptions,
}
