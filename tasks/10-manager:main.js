import gulp from 'gulp'
import pump from 'pump'
import path from 'path'
import babel from 'gulp-babel'
import prettyError from 'gulp-prettyerror'
import minify from 'gulp-minify'

const sources = {
  'manager': [
    'src/manager.js'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('manager:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.manager),
    babel(),
    gulp.dest(destination())
  ])
})

gulp.task('manager:prod', () => {
  return pump([
    prettyError(),
    gulp.src(sources.manager),
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
