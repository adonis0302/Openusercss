import gulp from 'gulp'
import pump from 'pump'
import path from 'path'
import prettyError from 'gulp-prettyerror'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

const sources = {
  'views': './src/views/**/*.pug'
}

gulp.task('server:views', () => {
  return pump([
    prettyError(),
    gulp.src(sources.views),
    gulp.dest(destination('views'))
  ])
})

gulp.task('server:views:watch', (done) => {
  gulp.watch('./src/views/**/*.pug', gulp.series('server:views'))
  done()
})
