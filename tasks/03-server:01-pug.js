import gulp from 'gulp'
import pump from 'pump'
import path from 'path'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

const sources = {
  'views':  './src/views/**/*.pug',
  'emails': './src/emails/**/*.pug',
}

gulp.task('server:views', (done) => {
  pump([
    gulp.src(sources.views),
    gulp.dest(destination('views')),
  ]).on('end', done)
})

gulp.task('server:email-templates', (done) => {
  pump([
    gulp.src(sources.emails),
    gulp.dest(destination('emails')),
  ]).on('end', done)
})
