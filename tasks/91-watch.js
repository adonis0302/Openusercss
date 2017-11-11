import gulp from 'gulp'

gulp.task('fs-watch', () => {
  gulp.watch('src/components/**/*', gulp.series(
    'shared:components:fast',
    'shared:pages:fast'
  ))

  gulp.watch('src/views/**/*.pug', gulp.series('server:views'))
  gulp.watch('src/shared/**/*.js', gulp.series('shared:fast'))
  gulp.watch('src/client/(fonts|img|scss)/**/*', gulp.series('client:media:fast'))

  gulp.watch('src/**/*', (...args) => {
    console.log(args)
  })
})

gulp.task('watch', gulp.series(
  'shared:components:fast',
  'shared:pages:fast',
  gulp.parallel(
    'shared:fast',
    'client:fast',
    'server:views',
  ),
  'server:fast',
  gulp.parallel(
    'server:run',
    'client:js:watch',
    'fs-watch'
  ))
)
