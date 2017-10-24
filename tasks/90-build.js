const gulp = require('gulp')

gulp.task('build:fast', gulp.parallel(
  'api:fast',
  'client:fast'
))

gulp.task('build:prod', gulp.parallel(
  'api:prod',
  'client:prod'
))

gulp.task('build:watch', gulp.parallel(
  'client:watch',
  'api:watch'
))

gulp.task('watch', gulp.series(
  'build:fast',
  'build:watch'
))
