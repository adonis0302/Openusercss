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

gulp.task('server:views', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.views),
    gulp.dest(destination('views'))
  ]).on('end', done)
})
