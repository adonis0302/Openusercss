import gulp from 'gulp'
import pump from 'pump'

import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackConfig from '../api.webpack.config.babel'

const sources = {
  'api': [
    'api/index.js',
  ],
}

gulp.task('api:prod', () => {
  return pump([
    gulp.src(sources.api),
    webpackStream(webpackConfig({
      'env':   'production',
      'watch': false,
    }), webpack),
    gulp.dest('./build'),
  ])
})

gulp.task('api:fast', () => {
  return pump([
    gulp.src(sources.api),
    webpackStream(webpackConfig({
      'env':   'development',
      'watch': false,
    }), webpack),
    gulp.dest('./build'),
  ])
})

gulp.task('api:watch', (done) => {
  return pump([
    gulp.src(sources.api),
    webpackStream(webpackConfig({
      'env':   'development',
      'watch': true,
    }), webpack),
    gulp.dest('./build'),
  ])
})
