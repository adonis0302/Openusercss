import gulp from 'gulp'

gulp.task('build', gulp.parallel(
  'static:prod',
  'static:email',
  'static:email-templates',
))

gulp.task('watch', gulp.parallel(
  'static:fast',
  'static:watch',
  'static:email',
  'static:email-templates',
))
