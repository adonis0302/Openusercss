const gulp = require('gulp')
const pump = require('pump')
const prettyError = require('gulp-prettyerror')

const browserify = require('browserify')
const uglify = require('gulp-uglify')

const babelify = require('babelify')
const es3ify = require('gulp-es3ify')

const vueify = require('vueify')
const watchify = require('watchify')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const hmr = require('browserify-hmr')
const glob = require('glob')
const merge = require('merge-stream')
const flatten = require('gulp-flatten')

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
            'env',
            'stage-3'
          ]
        }
      ]
    ]
  }
}

const sources = {
  'client': 'src/client/js/*.js'
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
      bify.bundle(),
      source(entry),
      flatten(),
      uglify(),
      es3ify(),
      gulp.dest('build/client/js')
    ])
  })

  return merge(bundles)
})

gulp.task('js:fast', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    gutil.log(`Bundling ${entry}`)
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
  'js:watch'
))

gulp.task('client:fast', gulp.series(
  'vue:fast',
  'js:fast'
))

gulp.task('client:prod', gulp.series(
  'vue:prod',
  'js:prod'
))
