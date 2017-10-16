const gulp = require('gulp')
const babel = require('gulp-babel')
const prettyError = require('gulp-prettyerror')
const pump = require('pump')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')

const sources = {
  'server': [
    'src/server/**/*.js'
  ],
  'shared': [
    'src/shared/**/*.js'
  ],
  'views': [
    'src/server/views/**/*'
  ]
}

gulp.task('express:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.server),
    babel(),
    gulp.dest('build')
  ])
})

gulp.task('express:prod', () => {
  return pump([
    prettyError(),
    gulp.src(sources.server),
    babel(),
    uglify(),
    gulp.dest('build')
  ])
})

gulp.task('shared:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    gulp.dest('build/shared')
  ])
})

gulp.task('shared:prod', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    uglify(),
    gulp.dest('build/shared')
  ])
})

gulp.task('views:copy', () => {
  return pump([
    prettyError(),
    gulp.src(sources.views),
    gulp.dest('build/views')
  ])
})

gulp.task('meta:copy', () => {
  return pump([
    prettyError(),
    gulp.src([
      'package.json',
      '.npmrc'
    ]),
    gulp.dest('build')
  ])
})

gulp.task('runtime:copy-secrets', () => {
  return pump([
    gulp.src('src/empty-file'),
    rename('secrets.json'),
    gulp.dest('build')
  ])
})

gulp.task('runtime:copy-config', () => {
  return pump([
    gulp.src('src/empty-file'),
    rename('config.json'),
    gulp.dest('build')
  ])
})

gulp.task('server:fast', gulp.parallel(
  'express:fast',
  'shared:fast',
  'views:copy',
  'meta:copy',
  'runtime:copy-secrets',
  'runtime:copy-config'
))

gulp.task('server:prod', gulp.parallel(
  'express:prod',
  'shared:prod',
  'views:copy',
  'meta:copy',
  'runtime:copy-secrets',
  'runtime:copy-config'
))
