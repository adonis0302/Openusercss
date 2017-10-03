const gulp = require('gulp')
const express = require('gulp-dev-express')

const fsWatch = () => {
  gulp.watch([
    'media/**',
    'src/public/**/*.scss'
  ], gulp.series('media-watch'))

  gulp.watch([
    'src/public/components/**/*'
  ], gulp.series('js-watch'))

  gulp.watch([
    'src/**/*.(js|pug)',
    '!src/public/**/*.(js|pug)'
  ], gulp.series('build-server', express('build/app.js')))
}

gulp.task('watch', gulp.series(
  gulp.parallel('js-watch', 'media-watch'),
  fsWatch
))
