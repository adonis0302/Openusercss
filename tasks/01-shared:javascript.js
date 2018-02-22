import gulp from 'gulp'
import path from 'path'
import pump from 'pump'
import babel from 'gulp-babel'

const sources = {
  'shared': [
    'src/shared/**/*.js',
  ],
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('shared:fast', () => {
  return pump([
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared')),
  ])
})

gulp.task('shared:prod', () => {
  return pump([
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared')),
  ])
})
