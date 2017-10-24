const gulp = require('gulp')
const pump = require('pump')
const glob = require('glob')
const source = require('vinyl-source-stream')
const merge = require('merge-stream')
const pwaManifest = require('pwa-manifest')

const prettyError = require('gulp-prettyerror')
const es3ify = require('gulp-es3ify')
const gutil = require('gulp-util')
const flatten = require('gulp-flatten')
const buffer = require('gulp-buffer')
const sourcemaps = require('gulp-sourcemaps')
const minify = require('gulp-minify')
const optimize = require('gulp-optimize-js')

const browserify = require('browserify')
const watchify = require('watchify')
const babelify = require('babelify')
const vueify = require('vueify')
const hmr = require('browserify-hmr')

const browserifyOpts = (mergeWith) => {
  const options = {
    ...mergeWith,
    'extensions': [
      '.js'
    ],
    'fullPaths':    false,
    'cache':        {},
    'packageCache': {},
    'transform':    [
      vueify,
      [
        babelify, {
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
        }
      ]
    ]
  }

  return options
}

const sources = {
  'client': 'src/client/js/!(worker).js',
  'worker': 'src/client/js/worker.js'
}

const createBrowserify = ({entries, debug}) => {
  return browserify(browserifyOpts({
    entries,
    debug
  }))
}

gulp.task('js:prod', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': false
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      optimize(),
      minify({
        'ext': {
          'src': '.js',
          'min': '.js'
        },
        'noSource': true,
        'mangle':   true,
        'compress': true
      }),
      es3ify(),
      flatten(),
      gulp.dest('build/client/js')
    ])
  })

  return merge(bundles)
})

gulp.task('js:fast', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': true
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      flatten(),
      buffer(),
      sourcemaps.init({
        'loadMaps': true
      }),
      sourcemaps.write('./build/client/js', {
        'sourceMappingURL': (file) => {
          return `/js/${file.relative}.map`
        }
      }),
      gulp.dest('build/client/js')
    ])
  })

  return merge(bundles)
})

gulp.task('js:watch', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': true
    })

    bify.plugin(watchify)
    bify.plugin(hmr, {
      'mode': 'websocket',
      'port': 3123 + index,
      'url':  `http://localhost:${3123 + index}`
    })

    const bundle = () => {
      return pump([
        prettyError(),
        bify.bundle(),
        source(entry),
        buffer(),
        flatten(),
        sourcemaps.init({
          'loadMaps': true
        }),
        sourcemaps.write('.', {
          'sourceMappingURL': (file) => {
            return `/js/${file.relative}.map`
          }
        }),
        gulp.dest('build/client/js')
      ])
    }

    bify.on('update', bundle)
    bify.on('log', gutil.log)

    return bundle()
  })

  return merge(bundles)
})

gulp.task('worker:prod', () => {
  const files = glob.sync(sources.worker)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': false
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      minify({
        'ext': {
          'src': '.js',
          'min': '.js'
        },
        'noSource': true,
        'mangle':   true,
        'compress': true
      }),
      es3ify(),
      flatten(),
      gulp.dest('build/client')
    ])
  })

  return merge(bundles)
})

gulp.task('worker:fast', () => {
  const bify = createBrowserify({
    'entries': [
      sources.worker
    ],
    'debug': true
  })

  return pump([
    prettyError(),
    bify.bundle(),
    source(sources.worker),
    buffer(),
    sourcemaps.init({
      'loadMaps': true
    }),
    sourcemaps.write('./build/client', {
      'sourceMappingURL': (file) => {
        return `/${file.relative}.map`
      }
    }),
    flatten(),
    gulp.dest('build/client')
  ])
})

gulp.task('worker:watch', () => {
  gulp.watch(sources.worker, gulp.series('worker:fast'))
})

gulp.task('manifest', (done) => {
  pwaManifest.write.sync('build/client/', {
    'dir':              'ltr',
    'name':             'OpenUserCSS',
    'short_name':       'OpenUserCSS',
    'description':      'Themes for your favourite websites',
    'start_url':        '/?utm_source=homescreen',
    'background_color': '#3E28B0',
    'theme_color':      '#005FFF',
    'display':          'standalone',
    'orientation':      'any',
    'icons':            [
      {'src': '/img/openusercss.icon-x16.png', 'sizes': '16x16', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x32.png', 'sizes': '32x32', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x64.png', 'sizes': '64x64', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x128.png', 'sizes': '128x128', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x360.png', 'sizes': '360x360', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x640.png', 'sizes': '640x640', 'type': 'image/png'}
    ]
  })
  done()
})

gulp.task('client:watch', gulp.parallel(
  'vue:watch',
  'js:watch',
  'manifest',
  gulp.series('worker:fast', 'worker:watch')
))

gulp.task('client:fast', gulp.series(
  'vue:fast',
  'js:fast',
  'worker:fast',
  'manifest'
))

gulp.task('client:prod', gulp.series(
  'vue:prod',
  'js:prod',
  'worker:prod',
  'manifest'
))
