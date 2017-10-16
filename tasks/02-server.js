const gulp = require('gulp')
const babel = require('gulp-babel')
const prettyError = require('gulp-prettyerror')
const pump = require('pump')
const uglify = require('gulp-uglify')

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
    babel(),
    uglify(),
    gulp.dest('build')
  ])
})

gulp.task('copy-express', () => {
  return pump([
    prettyError(),
    gulp.src([
      './src/**/*.js',
      '!./src/public/**/*.js'
    ]),
    babel(),
    gulp.dest('build')
  ])
})

gulp.task('server:prod', gulp.parallel(
  'build-express', 'copy-views', 'copy-meta'
))

gulp.task('server:fast', gulp.parallel(
  'copy-express', 'copy-views', 'copy-meta'
))
