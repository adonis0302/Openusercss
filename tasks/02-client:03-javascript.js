import gulp from 'gulp'
import pump from 'pump'
import pwaManifest from 'pwa-manifest'
import path from 'path'

import webpack from 'webpack'
import webpackStream from 'webpack-stream'
import webpackConfig from '../client.webpack.config.babel'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/static/')
  }

  return path.resolve('./build/static/', dest)
}

gulp.task('client:js:prod', () => {
  return pump([
    gulp.src('./src/client/js/*.js'),
    webpackStream(webpackConfig({
      'watch': false,
      'env':   'production',
    }), webpack),
    gulp.dest('./build/static'),
  ])
})

gulp.task('client:js:fast', () => {
  return pump([
    gulp.src('./src/client/js/*.js'),
    webpackStream(webpackConfig({
      'watch': false,
      'env':   'development',
    }), webpack),
    gulp.dest('./build/static'),
  ])
})

gulp.task('client:js:watch', () => {
  return pump([
    gulp.src('./src/client/js/*.js'),
    webpackStream(webpackConfig({
      'watch': true,
      'env':   'development',
    }), webpack),
    gulp.dest('./build/static'),
  ])
})

gulp.task('client:manifest', (done) => {
  pwaManifest.write.sync(destination(), {
    'dir':              'ltr',
    'name':             'OpenUserCSS',
    'short_name':       'OpenUserCSS',
    'description':      'Themes for your favourite websites',
    'start_url':        '/?utm_source=homescreen',
    'background_color': '#3E28B0',
    'theme_color':      '#005FFF',
    'display':          'standalone',
    'orientation':      'any',
    'icons':            [
      {
        'src':   '/img/openusercss.icon-x16.png',
        'sizes': '16x16',
        'type':  'image/png',
      },
      {
        'src':   '/img/openusercss.icon-x32.png',
        'sizes': '32x32',
        'type':  'image/png',
      },
      {
        'src':   '/img/openusercss.icon-x64.png',
        'sizes': '64x64',
        'type':  'image/png',
      },
      {
        'src':   '/img/openusercss.icon-x128.png',
        'sizes': '128x128',
        'type':  'image/png',
      },
      {
        'src':   '/img/openusercss.icon-x360.png',
        'sizes': '360x360',
        'type':  'image/png',
      },
      {
        'src':   '/img/openusercss.icon-x640.png',
        'sizes': '640x640',
        'type':  'image/png',
      },
    ],
  })
  done()
})

gulp.task('client:fast', gulp.parallel(
  'client:js:fast',
  'client:manifest',
))

gulp.task('client:prod', gulp.parallel(
  'client:js:prod',
  'client:manifest',
))
