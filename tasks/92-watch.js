const gulp = require('gulp')
const server = require('gulp-develop-server')

const fsWatch = () => {
  gulp.watch([
    'media/**',
    'src/public/**/*.scss'
  ], gulp.series('media-watch'))

  gulp.watch([
    'src/public/components/**/*'
  ], gulp.series('js-watch'))

  server.listen({
    'path': './build/app.js'
  })

  gulp.watch([
    'src/**/*.js',
    '!src/public/**/*.js'
  ], gulp.series('build-server', server.restart))

  gulp.watch([
    'src/**/*.pug'
  ], gulp.series('copy-views'))
}

gulp.task('watch', gulp.series(
  gulp.parallel('js-watch', 'media-watch', 'build-server'),
  fsWatch
))
