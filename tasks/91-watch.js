import gulp from 'gulp'

gulp.task('watch', gulp.series(
  gulp.parallel(
    'client:watch',
    'server:watch'
  ),
  'server:run'
))
