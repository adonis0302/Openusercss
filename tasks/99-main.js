import gulp from 'gulp'

gulp.task('build', gulp.parallel(
  'licenses',
  'static:prod',
  'static:email',
  'static:email-templates',
))

gulp.task('watch', gulp.series(
  gulp.parallel(
    'licenses',
    'static:email',
    'static:email-templates',
  ),
  gulp.parallel(
    'static:fast',
    'static:watch',
  )
))
