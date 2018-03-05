import gulp from 'gulp'

gulp.task('build', gulp.parallel(
  'api:prod',
  'static:prod',
  'static:email',
))

gulp.task('watch', gulp.series(
  'api:fast',
  gulp.parallel(
    'static:fast',
    'static:watch',
    'static:email',
    'api:watch',
  )
))
