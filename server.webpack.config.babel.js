import {
  NamedModulesPlugin,
} from 'webpack'
import path from 'path'
import assert from 'assert'
import fs from 'fs'

// Plugins
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const log = (prefix, ...contents) => {
  /* eslint-disable-next-line no-console */
  console.log(`${prefix}:`, `\x1b[1m${contents.join(' ')}\x1b[0m`)
}
const nodeModules = {}

/* eslint-disable-next-line no-sync */
fs.readdirSync('node_modules')
.filter((x) => {
  return [ '.bin', ].indexOf(x) === -1
})
.forEach((mod) => {
  nodeModules[mod] = `commonjs ${mod}`
})

const options = {
  'mode':   'production',
  'target': 'node',
  'entry':  {
    'api':       './src/api.js',
    'webserver': './src/webserver.js',
    'server':    './src/client/js/server.js',
  },
  'output': {
    'path':     path.resolve('build/'),
    'filename': '[name].bundle.min.js',
  },
  'module': {
    'rules': [
      {
        'test': /\.vue$/,
        'use':  'vue-loader',
      },
    ],
  },
  'plugins': [],
  'stats':   {
    'warnings': false,
    'colors':   true,
  },
  'externals': nodeModules,
}

export default ({watch, env,}) => {
  assert(watch === true || watch === false)
  assert(env === 'production' || env === 'development')

  options.plugins.push(new NamedModulesPlugin())

  if (env && env === 'development') {
    options.mode = env
    options.watch = watch
  } else {
    options.plugins.push(new UglifyJSPlugin())
  }

  log('[server] Webpack mode', options.mode)

  return options
}
