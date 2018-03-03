import {
  NamedModulesPlugin,
  HotModuleReplacementPlugin,
} from 'webpack'
import path from 'path'
import assert from 'assert'

// Plugins
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

const log = (prefix, ...contents) => {
  /* eslint-disable-next-line no-console */
  console.log(`${prefix}:`, `\x1b[1m${contents.join(' ')}\x1b[0m`)
}

const options = {
  'mode':  'production',
  'entry': {
    'browser': './src/client/js/browser.js',
    'worker':  './src/client/js/worker.js',
  },
  'output': {
    'path':     path.resolve('build/static/'),
    'filename': '[name].bundle.min.js',
  },
  'module': {
    'rules': [
      {
        'test': /\.vue$/,
        'use':  'vue-loader',
      },
      {
        'test': /\.(png|jpe?g|gif|svg)$/,
        'use':  {
          'loader':  'file-loader',
          'options': {
            'name': '/img/[name]_[hash:7].[ext]',
          },
        },
      },
    ],
  },
  'plugins': [],
}

export default ({watch, env,}) => {
  assert(watch === true || watch === false)
  assert(env === 'production' || env === 'development')

  if (env && env === 'development') {
    options.mode = env
    options.watch = watch

    options.plugins.push(new NamedModulesPlugin())
    options.plugins.push(new HotModuleReplacementPlugin())
  } else {
    options.plugins.push(new UglifyJSPlugin())
  }

  log('[client] Webpack mode', options.mode)

  return options
}
