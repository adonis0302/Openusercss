import gulp from 'gulp'
import ava from 'gulp-ava'
import pump from 'pump'

gulp.task('test', () => {
  return pump([
    gulp.src('test/*.js'),
    ava()
  ])
})

gulp.task('test:watch', () => {
  gulp.watch([
    'src/shared/**/*.js',
    'src/client/js/**/*.js',
    'test/**/*'
  ], gulp.series('test'))
})
