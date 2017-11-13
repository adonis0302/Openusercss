import gulp from 'gulp'
import server from './shared/server'
import {debounce} from 'lodash'

gulp.task('fs-watch', () => {
  gulp.watch('src/components/**/*', gulp.series(
    'shared:components:fast',
    'shared:pages:fast'
  ))

  gulp.watch('src/views/**/*.pug', gulp.series('server:views'))
  gulp.watch('src/shared/**/*.js', gulp.series('shared:fast'))
  gulp.watch('src/client/(fonts|img|scss)/**/*', gulp.series('client:media:fast'))

  gulp.watch([
    'build/*.js',
    'build/static/server.js'
  ], debounce(server.restart, 2000))
})

gulp.task('watch', gulp.series(
  'shared:components:fast',
  'shared:pages:fast',
  gulp.parallel(
    gulp.series('client:js:watch', 'client:media:fast'),
    'shared:fast',
    'client:manifest',
    'server:views',
    'server:watch',
  ),
  gulp.parallel(
    'server:run',
    'fs-watch'
  ))
)
