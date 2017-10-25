import gulp from 'gulp'
import pump from 'pump'
import path from 'path'
import babel from 'gulp-babel'
import prettyError from 'gulp-prettyerror'
import rename from 'gulp-rename'
import save from 'gulp-save'
import minify from 'gulp-minify'

const sources = {
  'server': [
    'src/api/**/*.js'
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
  'api:meta:copy',
  'api:runtime:empties'
))

gulp.task('api:prod', gulp.parallel(
  'api:express:prod',
  'api:meta:copy',
  'api:runtime:empties'
))
