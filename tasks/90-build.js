const gulp = require('gulp')
const server = require('gulp-develop-server')

gulp.task('build:fast', gulp.parallel(
  'api:fast',
  'client:fast',
  'shared:fast',
  'manager:fast'
))

gulp.task('build:prod', gulp.parallel(
  'api:prod',
  'client:prod',
  'shared:prod',
  'manager:prod'
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
}

gulp.task('watch', watch)
