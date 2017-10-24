const gulp = require('gulp')
const pump = require('pump')
const path = require('path')

const babel = require('gulp-babel')
const prettyError = require('gulp-prettyerror')
const rename = require('gulp-rename')
const save = require('gulp-save')
const server = require('gulp-develop-server')
const minify = require('gulp-minify')

const sources = {
  'server': [
    'src/api/**/*.js'
  ],
  'shared': [
    'src/shared/**/*.js'
  ],
  'views': [
    'src/api/views/**/*'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/api/')
  }

  return path.resolve('./build/api/', dest)
}

gulp.task('api:express:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.server),
    babel(),
    gulp.dest(destination())
  ])
})

gulp.task('api:express:prod', () => {
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
    gulp.dest(destination())
  ])
})

gulp.task('api:shared:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared'))
  ])
})

gulp.task('api:shared:prod', () => {
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
    gulp.dest(destination('shared'))
  ])
})

gulp.task('api:meta:copy', () => {
  return pump([
    prettyError(),
    gulp.src([
      'package.json',
      '.npmrc'
    ]),
    gulp.dest(destination())
  ])
})

gulp.task('api:runtime:empties', () => {
  return pump([
    gulp.src('src/empty-file'),
    save('created'),

    rename('secrets.json'),
    gulp.dest('build', {
      'overwrite': false
    }),

    save.restore('created'),
    rename('config.json'),
    gulp.dest(destination(), {
      'overwrite': false
    })
  ])
})

gulp.task('api:fast', gulp.parallel(
  'api:express:fast',
  'api:shared:fast',
  'api:meta:copy',
  'api:runtime:empties'
))

gulp.task('api:prod', gulp.parallel(
  'api:express:prod',
  'api:shared:prod',
  'api:meta:copy',
  'api:runtime:empties'
))

gulp.task('api:watch', () => {
  server.listen({
    'path': './build/api/index'
  })

  gulp.watch([
    'src/api/**/*.js',
    'src/shared/**/*.js',
    'package.json',
    '.npmrc'
  ], gulp.series('api:fast', server.restart))
})
