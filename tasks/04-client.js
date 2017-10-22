const gulp = require('gulp')
const pump = require('pump')
const glob = require('glob')
const source = require('vinyl-source-stream')
const merge = require('merge-stream')

const prettyError = require('gulp-prettyerror')
const uglify = require('gulp-uglify')
const es3ify = require('gulp-es3ify')
const gutil = require('gulp-util')
const flatten = require('gulp-flatten')
const buffer = require('gulp-buffer')

const browserify = require('browserify')
const babelify = require('babelify')
const vueify = require('vueify')
const watchify = require('watchify')
const hmr = require('browserify-hmr')

const browserifyOpts = ({entries}) => {
  return {
    entries,
    'extensions': [
      '.js'
    ],
    'debug':        false,
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
}

const sources = {
  'client': 'src/client/js/!(worker).js',
  'worker': 'src/client/js/worker.js'
}

const createBrowserify = ({entries}) => {
  return browserify(browserifyOpts({
    entries
  }))
}

gulp.task('js:prod', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ]
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      uglify(),
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
      ]
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      flatten(),
      gulp.dest('build/client/js')
    ])
  })

  return merge(bundles)
})

gulp.task('worker:prod', () => {
  const files = glob.sync(sources.worker)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ]
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      uglify(),
      es3ify(),
      flatten(),
      gulp.dest('build/client/js')
    ])
  })

  return merge(bundles)
})

gulp.task('worker:fast', () => {
  const bify = createBrowserify({
    'entries': [
      sources.worker
    ]
  })

  return pump([
    prettyError(),
    bify.bundle(),
    source(sources.worker),
    flatten(),
    gulp.dest('build/client/js')
  ])
})

gulp.task('worker:watch', () => {
  gulp.watch(sources.worker, gulp.series('worker:fast'))
})

gulp.task('js:watch', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ]
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
        flatten(),
        gulp.dest('build/client/js')
      ])
    }

    bify.on('update', bundle)
    bify.on('log', gutil.log)

    return bundle()
  })

  return merge(bundles)
})

gulp.task('client:watch', gulp.parallel(
  'vue:watch',
  'js:watch',
  gulp.series('worker:fast', 'worker:watch')
))

gulp.task('client:fast', gulp.series(
  'vue:fast',
  'js:fast',
  'worker:fast'
))

gulp.task('client:prod', gulp.series(
  'vue:prod',
  'js:prod',
  'worker:prod'
))
