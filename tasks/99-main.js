import gulp from 'gulp'

gulp.task('build', gulp.parallel(
  'licenses',
  'static:prod',
  'static:email',
  'static:email-templates',
))

gulp.task('api:watch', gulp.parallel(
  'licenses',
  'static:email',
  'static:email-templates',
))

gulp.task('client:watch', gulp.parallel(
  'static:fast',
  'static:watch',
))
