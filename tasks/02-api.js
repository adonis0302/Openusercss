import gulp from 'gulp'

import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackConfig from '../api.webpack.config.babel'

gulp.task('api:prod', () => {
  return webpackStream(webpackConfig({
    'env':   'production',
    'watch': false,
  }), webpack)
})

gulp.task('api:fast', () => {
  return webpackStream(webpackConfig({
    'env':   'development',
    'watch': false,
  }), webpack)
})

gulp.task('api:watch', (done) => {
  return webpackStream(webpackConfig({
    'env':   'development',
    'watch': true,
  }), webpack)
})
