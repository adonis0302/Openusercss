import gulp from 'gulp'
import server from 'gulp-develop-server'

gulp.task('api:run', () => {
  return server.listen({
    'path':       './build/api.bundle.min',
    'killSignal': 'SIGTERM',
    'env':        process.env,
  })
})

gulp.task('build', gulp.parallel(
  'api:prod',
  'static:prod',
  'static:email'
))

gulp.task('watch', gulp.series(
  'api:fast',
  gulp.parallel(
    'static:fast',
    'static:watch',
    'static:email',
    'api:watch',
    'api:run'
  )
))
