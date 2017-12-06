import gulp from 'gulp'

gulp.task('build:fast', gulp.series(
  'test',
  'shared:components:fast',
  'shared:pages:fast',
  gulp.parallel(
    'shared:fast',
    'client:fast',
  ),
  'server:views',
  'server:fast'
))

gulp.task('build:prod', gulp.series(
  'test',
  'shared:components:prod',
  'shared:pages:prod',
  gulp.parallel(
    'shared:prod',
    'client:prod',
  ),
  'server:views',
  'server:prod'
))
