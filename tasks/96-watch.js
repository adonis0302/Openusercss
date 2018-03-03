import gulp from 'gulp'
import server from './shared/server'

gulp.task('fs-watch', () => {
  gulp.watch('src/views/**/*.pug', gulp.series('server:views'))
  gulp.watch('src/emails/**/*.pug', gulp.series('server:email-templates', server.restart))
})

gulp.task('watch', gulp.series(
  gulp.parallel(
    'server:views',
    'server:email-templates',
  ),
  gulp.parallel(
    'client:js:watch',
    'server:watch',
    'fs-watch',
  )
))
