import browserify from 'browserify'
import babelify from 'babelify'
import vueify from 'vueify'
import envify from 'loose-envify'
import {defaultsDeep,} from 'lodash'
import banner from 'browserify-banner'
import git from 'git-revision'
import fs from 'fs'
import pug from 'pug'
import uglifyify from 'uglifyify'

const babelOptions = {
  'presets': [
    'vue',
    'flow',
    [
      'env', {
        'targets': {
          'browsers': [
            'last 4 versions',
          ],
        },
      },
    ],
    'stage-3',
  ],
}
const revision = {
  'revisionLong':   git('long'),
  'revisionShort':  git('short'),
  'revisionTag':    git('tag'),
  'revisionBranch': git('branch'),
}
// eslint-disable-next-line no-sync
const changelog = fs.readFileSync('CHANGELOG.md')

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

  if (input.target === 'browser') {
    input.plugin = [
      [
        banner, {
          'banner': `
            if (window) {
              if (!window.revision) {
                window.revision = Object.freeze(${JSON.stringify(revision)});
              }
              if (!window.changelog) {
                window.changelog = unescape('${escape(changelog.toString())}');
              }
            }
          `,
        },
      ],
    ]
  }

  if (input.target === 'worker') {
    input.plugin = [
      [
        banner, {
          'banner': `self.revision = Object.freeze(${JSON.stringify(revision)});`,
        },
      ],
    ]
  }

  const options = defaultsDeep(input, {
    'extensions': [
      '.js',
    ],
    'standalone':   input.entries[0].split('/')[input.entries[0].split('/').length - 1],
    'fullPaths':    false,
    'cache':        {},
    'packageCache': {},
  })

  return options
}

export const createBrowserify = (opts) => {
  const bify = browserify(browserifyOpts(opts))

  bify.transform(vueify, {
    'customCompilers': {
      'pug': (content, done, compiler, file) => {
        done(null, pug.render(content, {
          'filename': file,
        }))
      },
    },
  })

  if (!opts.debug) {
    bify.transform(uglifyify, {
      'global': true,
    })
  }

  bify.transform(envify, process.env)

  switch (opts.target) {
  case 'browser':
    bify.transform(babelify, {
      'presets': [
        'flow',
        [
          'env', {
            'targets': {
              'node':     '4',
              'browsers': [
                'last 4 versions',
              ],
            },
          },
        ],
        'stage-3',
      ],
    })
    bify.plugin('vueify/plugins/extract-css', {
      'out': '.tmp/components.min.css',
    })
    break
  case 'node':
    bify.transform(babelify)
    bify.plugin('vueify/plugins/extract-css', {
      'out': '/dev/null',
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
                'last 4 versions',
              ],
            },
          },
        ],
      ],
    })
    break
  default:
    throw new Error('No target specified in options object')
  }

  return bify
}
