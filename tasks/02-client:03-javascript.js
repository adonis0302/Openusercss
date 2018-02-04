import gulp from 'gulp'
import pump from 'pump'
import glob from 'glob'
import source from 'vinyl-source-stream'
import pwaManifest from 'pwa-manifest'
import path from 'path'
import gutil from 'gulp-util'
import flatten from 'gulp-flatten'
import buffer from 'gulp-buffer'
import sourcemaps from 'gulp-sourcemaps'
import optimize from 'gulp-optimize-js'
import watchify from 'watchify'
import hmr from 'browserify-hmr'
import merge from 'merge-stream'

import server from './shared/server'
import {createBrowserify,} from './shared/js'

const sources = {
  'client': 'src/client/js/*.js',
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/static/')
  }

  return path.resolve('./build/static/', dest)
}

gulp.task('client:js:prod', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const options = {
      'entries': [
        entry,
      ],
      'debug':  false,
      'target': 'browser',
    }

    if (entry.indexOf('server') !== -1) {
      options.target = 'node'
    }
    if (entry.indexOf('worker') !== -1) {
      options.target = 'worker'
    }
    const bify = createBrowserify(options)

    return pump([
      bify.bundle(),
      source(entry),
      buffer(),
      optimize(),
      flatten(),
      sourcemaps.init({
        'loadMaps': true,
      }),
      sourcemaps.write(destination(), {
        'sourceMappingURL': (file) => {
          return `/${file.relative}.map`
        },
      }),
      flatten(),
      gulp.dest(destination()),
    ])
  })

  return merge(bundles)
})

gulp.task('client:js:fast', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const options = {
      'entries': [
        entry,
      ],
      'debug':  true,
      'target': 'browser',
    }

    if (entry.indexOf('server') !== -1) {
      options.target = 'node'
    }
    if (entry.indexOf('worker') !== -1) {
      options.target = 'worker'
    }
    const bify = createBrowserify(options)

    return pump([
      bify.bundle(),
      source(entry),
      buffer(),
      flatten(),
      sourcemaps.init({
        'loadMaps': true,
      }),
      sourcemaps.write(destination(), {
        'sourceMappingURL': (file) => {
          return `/${file.relative}.map`
        },
      }),
      flatten(),
      gulp.dest(destination()),
    ])
  })

  return merge(bundles)
})

gulp.task('client:js:watch', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const options = {
      'entries': [
        entry,
      ],
      'debug':  true,
      'target': 'browser',
    }

    if (entry.indexOf('server') !== -1) {
      options.target = 'node'
    }
    if (entry.indexOf('worker') !== -1) {
      options.target = 'worker'
    }

    const bify = createBrowserify(options)

    bify.plugin(watchify)
    if (options.target === 'browser') {
      bify.plugin(hmr, {
        'mode': 'websocket',
        'port': 3123 + index,
        'url':  `http://localhost:${3123 + index}`,
      })
    }

    const bundle = () => {
      return pump([
        bify.bundle(),
        source(entry),
        buffer(),
        flatten(),
        sourcemaps.init({
          'loadMaps': true,
        }),
        sourcemaps.write(destination(), {
          'sourceMappingURL': (file) => {
            return `/${file.relative}.map`
          },
        }),
        flatten(),
        gulp.dest(destination()),
      ]).on('end', () => {
        if (options.target === 'node' && server.child) {
          server.restart()
        }
      })
    }

    bify.on('update', bundle)
    bify.on('log', (content) => {
      gutil.log(`Client (${entry}): ${content}`)
    })

    return bundle()
  })

  return merge(bundles)
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
  'client:media:email',
  gulp.series('client:js:fast', 'client:media:fast'),
  'client:manifest'
))

gulp.task('client:prod', gulp.parallel(
  'client:media:email',
  gulp.series('client:js:prod', 'client:media:prod'),
  'client:manifest'
))
