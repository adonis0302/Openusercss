import gulp from 'gulp'
import pump from 'pump'

import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackConfig from '../server.webpack.config.babel'

gulp.task('server:prod', () => {
  return pump([
    gulp.src('./src/*.js'),
    webpackStream(webpackConfig({
      'env':   'production',
      'watch': false,
    }), webpack),
    gulp.dest('./build'),
  ])
})

gulp.task('server:fast', () => {
  return pump([
    gulp.src('./src/*.js'),
    webpackStream(webpackConfig({
      'env':   'development',
      'watch': false,
    }), webpack),
    gulp.dest('./build'),
  ])
})

gulp.task('server:watch', () => {
  return pump([
    gulp.src('./src/*.js'),
    webpackStream(webpackConfig({
      'env':   'development',
      'watch': true,
    }), webpack),
    gulp.dest('./build'),
  ])
})
