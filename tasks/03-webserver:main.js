import gulp from 'gulp'
import pump from 'pump'
import path from 'path'
import babel from 'gulp-babel'
import prettyError from 'gulp-prettyerror'
import minify from 'gulp-minify'

const sources = {
  'server': [
    'src/webserver/**/*.js'
  ],
  'views': [
    'src/webserver/views/**/*'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/webserver/')
  }

  return path.resolve('./build/webserver/', dest)
}

gulp.task('webserver:express:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.server),
    babel(),
    gulp.dest(destination())
  ])
})

gulp.task('webserver:express:prod', () => {
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

gulp.task('webserver:config:copy', () => {
  return pump([
    prettyError(),
    gulp.src([
      'src/webserver/nuxt.config.js'
    ]),
    gulp.dest(destination())
  ])
})

gulp.task('webserver:fast', gulp.parallel(
  'webserver:express:fast',
  'webserver:config:copy'
))

gulp.task('webserver:prod', gulp.parallel(
  'webserver:express:prod',
  'webserver:config:copy'
))
