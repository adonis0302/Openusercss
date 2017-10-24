const gulp = require('gulp')

gulp.task('build:fast', gulp.parallel(
  'media:fast',
  'server:fast',
  'client:fast'
))

gulp.task('build:prod', gulp.parallel(
  'media:prod',
  'server:prod',
  'client:prod'
))

gulp.task('build:watch', gulp.parallel(
  'media:watch',
  'client:watch',
  'server:watch'
))

gulp.task('watch', gulp.series(
  'build:fast',
  'build:watch'
))
