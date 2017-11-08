import gulp from 'gulp'
import path from 'path'
import pump from 'pump'
import prettyError from 'gulp-prettyerror'
import babel from 'gulp-babel'
import minify from 'gulp-minify'
import {pubsub} from './shared/bus'

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

gulp.task('shared:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared'))
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
    gulp.dest(destination('shared'))
  ])
})

pubsub.subscribe('update:shared:js', gulp.series('shared:fast'))
