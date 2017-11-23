import gulp from 'gulp'
import path from 'path'
import pump from 'pump'
import prettyError from 'gulp-prettyerror'
import babel from 'gulp-babel'
import minify from 'gulp-minify'

const sources = {
  'shared': [
    'src/shared/**/*.js'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('shared:fast', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared'))
  ]).on('end', done)
})

gulp.task('shared:prod', (done) => {
  pump([
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
  ]).on('end', done)
})
