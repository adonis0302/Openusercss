import gulp from 'gulp'

gulp.task('build', gulp.parallel(
  'static:prod',
  'static:email',
))

gulp.task('watch', gulp.parallel(
  'static:fast',
  'static:watch',
  'static:email',
))
