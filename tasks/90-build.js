const gulp = require('gulp')

gulp.task('build:fast', gulp.parallel(
  'media:fast',
  'server:fast',
  'client:fast'
))

/* gulp.task('zip-source', (done) => {
  spawnSync('git', ['archive', '--format=zip', '-o', 'build/source.zip', '-9', 'HEAD'])
  done()
})

gulp.task('build', gulp.series(
  cleanBuild,
  gulp.parallel('js-build', 'media-build')
)) */
