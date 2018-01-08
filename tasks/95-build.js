import gulp from 'gulp'

gulp.task('build:fast', gulp.series(
  gulp.parallel(
    'shared:fast',
    'client:fast',
  ),
  'server:views',
  'server:email-templates',
  'server:fast'
))

gulp.task('build:prod', gulp.series(
  gulp.parallel(
    'shared:prod',
    'client:prod',
  ),
  'server:views',
  'server:email-templates',
  'server:prod'
))
