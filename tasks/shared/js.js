import browserify from 'browserify'
import babelify from 'babelify'
import vueify from 'vueify'
import envify from 'loose-envify'
import extractCss from 'vueify-extract-css'
import path from 'path'
import {defaultsDeep} from 'lodash'

const babelOptions = {
  'presets': [
    'vue',
    'flow',
    [
      'env', {
        'targets': {
          'browsers': [
            'last 4 versions'
          ]
        }
      }
    ],
    'stage-3'
  ]
}

export default babelOptions

export const processObject = (object, func) => {
  for (const index in object) {
    if (typeof object[index] === 'object') {
      object[index] = processObject(object[index], func)
    } else {
      object[index] = func(index, object[index])
    }
  }

  return object
}

export const browserifyOpts = (input) => {
  if (input.target === 'node') {
    input.bundleExternal = false
  }

  const options = defaultsDeep(input, {
    'extensions': [
      '.js'
    ],
    'standalone':   input.entries[0].split('/')[input.entries[0].split('/').length - 1],
    'fullPaths':    false,
    'cache':        {},
    'packageCache': {}
  })

  return options
}

export const createBrowserify = (opts) => {
  const bify = browserify(browserifyOpts(opts))

  bify.transform(vueify)
  bify.transform(envify, {
    'NODE_ENV': process.env.NODE_ENV || 'production'
  })

  switch (opts.target) {
  case 'browser':
    bify.transform(babelify, {
      'presets': [
        'vue',
        'flow',
        [
          'env', {
            'targets': {
              'node':     '4',
              'browsers': [
                'last 4 versions'
              ]
            }
          }
        ],
        'stage-3'
      ]
    })
    if (process.env.NODE_ENV !== 'development') {
      bify.plugin(extractCss, {
        'out': path.resolve('.tmp/components.min.css')
      })
    }
    break
  case 'node':
    bify.transform(babelify)
    bify.plugin(extractCss, {
      'out': '/dev/null'
    })
    break
  case 'worker':
    bify.transform(babelify, {
      'presets': [
        [
          'env', {
            'targets': {
              'node':     '4',
              'browsers': [
                'last 4 versions'
              ]
            }
          }
        ]
      ]
    })
    break
  default:
    throw new Error('No target specified in options object')
  }

  return bify
}
