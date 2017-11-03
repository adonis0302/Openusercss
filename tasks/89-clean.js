import gulp from 'gulp'
import path from 'path'
import del from 'del'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('clean:vue', () => {
  return del([
    destination('webserver/components'),
    destination('webserver/pages')
  ])
})
