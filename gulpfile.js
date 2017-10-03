/* eslint no-console: "off" */
const gulp = require('gulp')
const requireDir = require('require-dir')

requireDir('./tasks/', {
  'recurse': true
})

gulp.task('dev', gulp.series('build', 'watch'))
gulp.task('default', gulp.series('dev'))
