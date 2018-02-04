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

gulp.task('shared:fast', (done) => {
  pump([
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared')),
  ]).on('end', done)
})

gulp.task('shared:prod', (done) => {
  pump([
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared')),
  ]).on('end', done)
})
