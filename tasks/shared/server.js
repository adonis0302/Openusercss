import gulp from 'gulp'
import server from 'gulp-develop-server'

gulp.task('server:run', () => {
  server.listen({
    'path':       './build/manager',
    'killSignal': 'SIGTERM',
    'env':        process.env,
  })
})

export default server
