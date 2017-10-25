import gulp from 'gulp'
import server from 'gulp-develop-server'

gulp.task('build:fast', gulp.parallel(
  'api:fast',
  'client:fast',
  'shared:fast',
  'manager:fast',
  'webserver:fast'
))

gulp.task('build:prod', gulp.parallel(
  'api:prod',
  'client:prod',
  'shared:prod',
  'manager:prod',
  'webserver:prod'
))

const watch = () => {
  server.listen({
    'path':       './build/manager',
    'killSignal': 'SIGTERM'
  })

  gulp.watch([
    'src/manager.js'
  ], gulp.series('manager:fast', server.restart))

  gulp.watch([
    'src/api/**/*.js',
    'package.json',
    '.npmrc'
  ], gulp.series('api:fast', server.restart))

  gulp.watch([
    'src/webserver/**/*.js'
  ], gulp.series('webserver:fast', server.restart))
}

gulp.task('watch', watch)
