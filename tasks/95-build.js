import gulp from 'gulp'

gulp.task('build:fast', gulp.parallel(
  'client:fast',
  'server:views',
  'server:email-templates',
  'server:fast'
))

gulp.task('build:prod', gulp.parallel(
  'client:prod',
  'server:views',
  'server:email-templates',
  'server:prod'
))
