import gulp from 'gulp'
import server from './shared/server'

gulp.task('fs-watch', () => {
  gulp.watch('src/views/**/*.pug', gulp.series('server:views'))
  gulp.watch('src/emails/**/*.pug', gulp.series('server:email-templates', server.restart))
  gulp.watch('src/shared/**/*.js', gulp.series('shared:fast'))
  gulp.watch('src/client/(fonts|img|scss)/**/*', gulp.parallel('client:media:fast', 'client:media:email'))
})

gulp.task('watch', gulp.series(
  gulp.parallel(
    'client:media:email',
    gulp.series('client:js:watch', 'client:media:fast'),
    'shared:fast',
    'client:manifest',
    'server:views',
    'server:email-templates',
    'server:watch'
  ),
  gulp.parallel(
    'server:run',
    'fs-watch'
  ))
)
