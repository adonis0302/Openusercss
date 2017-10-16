const gulp = require('gulp')
const pump = require('pump')
const size = require('gulp-size')
const prettyError = require('gulp-prettyerror')

const browserify = require('browserify')
const uglify = require('gulp-uglify')

const buffer = require('gulp-buffer')
const babelify = require('babelify')
const es3ify = require('gulp-es3ify')

const vueify = require('vueify')
const watchify = require('watchify')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
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
            'env',
            'stage-3'
          ]
        }
      ]
    ]
  }
}

const bify = browserify(browserifyOpts({
  'entries': [
    './src/client/js/index.js',
    './src/client/js/loader.js'
  ]
}))
const wify = watchify(browserify(browserifyOpts({
  'entries': [
    './src/client/js/index.js',
    './src/client/js/loader.js'
  ]
})))

wify.plugin(hmr, {
  'mode': 'websocket'
})

gulp.task('js:prod', () => {
  return pump([
    prettyError(),
    bify.bundle(),
    source('bundle.min.js'),
    buffer(),
    uglify(),
    es3ify(),
    size(),
    gulp.dest('build/client/js')
  ])
})

gulp.task('js:fast', () => {
  return pump([
    prettyError(),
    bify.bundle(),
    source('bundle.min.js'),
    gulp.dest('build/client/js')
  ])
})

gulp.task('js:watch', () => {
  return pump([
    prettyError(),
    wify.bundle(),
    source('bundle.min.js'),
    gulp.dest('build/client/js')
  ])
})

wify.on('update', gulp.series('js:watch'))
wify.on('log', gutil.log)

gulp.task('client:watch', gulp.series(
  'vue:fast',
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
