const gulp = require('gulp')
const pump = require('pump')
const size = require('gulp-size')
const prettyError = require('gulp-prettyerror')
const gulpif = require('gulp-if')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const merge = require('merge-stream')

const browserify = require('browserify')
const closure = require('google-closure-compiler-js').gulp()
const uglify = require('gulp-uglify')

const buffer = require('gulp-buffer')
const babelify = require('babelify')
const babel = require('gulp-babel')
const es3ify = require('gulp-es3ify')

const vueify = require('vueify')
const watchify = require('watchify')
const gutil = require('gulp-util')
const source = require('vinyl-source-stream')
const hmr = require('browserify-hmr')

const browserifyOpts = {
  'entries':      [ './src/public/js/script.js' ],
  'extensions':   [ '.js' ],
  'debug':        false,
  'fullPaths':    false,
  'cache':        {},
  'packageCache': {}
}

const bify = browserify(browserifyOpts)
.transform(vueify)
.transform(babelify, {
  'presets': [
    'flow',
    'env',
    'stage-3'
  ]
})

const wify = watchify(browserify(browserifyOpts))
.transform(babelify, {
  'presets': [
    'flow',
    'env',
    'stage-3'
  ]
})
.plugin(hmr, {
  'mode': 'websocket'
})
.transform(vueify)

const bundle = () => {
  return pump([
    prettyError(),
    bify.bundle(),
    source('bundle.js'),
    buffer(),
    es3ify(),
    rename('bundle.min.js'),
    closure({
      'compilationLevel': 'SIMPLE',
      'warningLevel':     'QUIET',
      'jsOutputFile':     'bundle.min.js'
    }),
    uglify(),
    size(),
    gulp.dest('build/public/js')
  ])
}
const wundle = () => {
  return pump([
    prettyError(),
    wify.bundle(),
    source('bundle.js'),
    buffer(),
    sourcemaps.init({'loadMaps': true}),
    rename('bundle.min.js'),
    sourcemaps.write('./'),
    gulpif('*.map', rename('bundle.min.js.map')),
    size(),
    gulp.dest('build/public/js')
  ])
}

gulp.task('copy-meta', () => {
  return pump([
    prettyError(),
    gulp.src([
      'package.json',
      '.npmrc'
    ]),
    gulp.dest('build')
  ])
})

gulp.task('copy-fonts', () => {
  return pump([
    prettyError(),
    gulp.src([
      'node_modules/mdi/fonts/**/*'
    ], {
      'base': './node_modules/mdi'
    }),
    gulp.dest('build/public')
  ])
})

gulp.task('copy-views', () => {
  return pump([
    prettyError(),
    gulp.src([
      'src/views/**/*.pug',
      'src/views/**/*.pug'
    ], {
      'base': './src'
    }),
    gulp.dest('build')
  ])
})

gulp.task('build-express', () => {
  return pump([
    prettyError(),
    gulp.src([
      './src/**/*.js',
      '!./src/public/**/*.js'
    ]),
    babel({
      'presets': [
        'flow',
        'env',
        'stage-3'
      ]
    }),
    uglify(),
    gulp.dest('build')
  ])
})

gulp.task('build-server', gulp.parallel(
  'build-express', 'copy-views', 'copy-meta'
))

/* gulp.task('server', () => {
  return pump([
    prettyError(),
    merge(serverStream, viewsStream, directFileStream),
    gulp.dest('build')
  ])
}) */

wify.on('update', wundle)
wify.on('log', gutil.log)

gulp.task('js-build', gulp.series(
  gulp.parallel('build-server', 'vue-build'),
  bundle
))
gulp.task('js-watch', gulp.series(
  'vue-watch',
  wundle
))
