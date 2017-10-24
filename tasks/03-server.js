const gulp = require('gulp')
const pump = require('pump')

const babel = require('gulp-babel')
const prettyError = require('gulp-prettyerror')
const rename = require('gulp-rename')
const save = require('gulp-save')
const server = require('gulp-develop-server')
const minify = require('gulp-minify')

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
    minify({
      'ext': {
        'src': '.js',
        'min': '.js'
      },
      'noSource': true,
      'mangle':   true,
      'compress': true
    }),
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
    minify({
      'ext': {
        'src': '.js',
        'min': '.js'
      },
      'noSource': true,
      'mangle':   true,
      'compress': true
    }),
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

gulp.task('runtime:empties', () => {
  return pump([
    gulp.src('src/empty-file'),
    save('created'),

    rename('secrets.json'),
    gulp.dest('build', {
      'overwrite': false
    }),

    save.restore('created'),
    rename('config.json'),
    gulp.dest('build', {
      'overwrite': false
    })
  ])
})

gulp.task('server:fast', gulp.parallel(
  'express:fast',
  'shared:fast',
  'views:copy',
  'meta:copy',
  'runtime:empties'
))

gulp.task('server:prod', gulp.parallel(
  'express:prod',
  'shared:prod',
  'views:copy',
  'meta:copy',
  'runtime:empties'
))

gulp.task('server:watch', () => {
  server.listen({
    'path': './build/app'
  })

  gulp.watch([
    'src/server/**/*.js',
    'src/shared/**/*.js',
    'package.json',
    '.npmrc'
  ], gulp.series('server:fast', server.restart))

  gulp.watch([
    'src/server/views/**/*'
  ], gulp.series('views:copy'))
})
