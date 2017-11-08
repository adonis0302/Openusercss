import gulp from 'gulp'
import gutil from 'gulp-util'
import {pubsub} from './shared/bus'

gulp.task('watch', () => {
  gulp.watch('src/components/**/*', () => {
    const message = 'update:client:components'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })

  gulp.watch('src/client/(fonts|img|scss)/**/*', () => {
    const message = 'update:client:assets'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })

  gulp.watch('src/views/**/*.pug', () => {
    const message = 'update:web:views'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })

  gulp.watch('src/*.js', () => {
    const message = 'update:server:entries'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })

  gulp.watch('src/client/js/*.js', () => {
    const message = 'update:client:js'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })

  gulp.watch('src/shared/**/*.js', () => {
    const message = 'update:shared:js'

    gutil.log(`Sending ${message}`)
    pubsub.publish(message)
  })
})

/* gulp.series(
  gulp.parallel(
    'client:watch',
    'server:watch',
    'server:views:watch'
  ),
  'server:run'
) */
