import gulp from 'gulp'
import server from 'gulp-develop-server'

gulp.task('static:watch', () => {
  gulp.watch('src/client/img/**/*', gulp.series('static:fast'))
})

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
    'static:email',
    'static:watch',
    'api:watch',
    'api:run'
  )
))
