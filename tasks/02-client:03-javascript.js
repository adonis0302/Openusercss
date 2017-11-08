import gulp from 'gulp'
import pump from 'pump'
import glob from 'glob'
import source from 'vinyl-source-stream'
import merge from 'merge-stream'
import pwaManifest from 'pwa-manifest'
import path from 'path'
import prettyError from 'gulp-prettyerror'
import es3ify from 'gulp-es3ify'
import gutil from 'gulp-util'
import flatten from 'gulp-flatten'
import buffer from 'gulp-buffer'
import sourcemaps from 'gulp-sourcemaps'
import minify from 'gulp-minify'
import optimize from 'gulp-optimize-js'
import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import vueify from 'vueify'
import hmr from 'browserify-hmr'
import envify from 'loose-envify'
import extractCss from 'vueify-extract-css'
import {pubsub} from './shared/bus'
import server from './shared/server'

const browserifyOpts = (mergeWith) => {
  const options = {
    ...mergeWith,
    'extensions': [
      '.js'
    ],
    'standalone':   'server',
    'fullPaths':    false,
    'cache':        {},
    'packageCache': {}
  }

  return options
}

const sources = {
  'client': 'src/client/js/*.js'
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/static/')
  }

  return path.resolve('./build/static/', dest)
}

const createBrowserify = ({entries, debug}) => {
  const bify = browserify(browserifyOpts({
    entries,
    debug
  }))

  bify.transform(vueify)
  bify.transform(envify, {
    // eslint-disable-next-line
    'NODE_ENV': process.env.NODE_ENV || 'development'
  })
  bify.transform(babelify, {
    'presets': [
      'vue',
      'flow',
      [
        'env', {
          'targets': {
            'node':     '4',
            'browsers': [
              'last 4 versions'
            ]
          }
        }
      ],
      'stage-3'
    ]
  })
  bify.plugin(extractCss, {
    'out': path.resolve('.tmp/components.min.css')
  })

  return bify
}

gulp.task('client:js:prod', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const options = {
      'entries': [
        entry
      ],
      'debug': true
    }

    if (entry.split('/')[entry.split('/').length - 1] === 'server.js') {
      options.standalone = 'server'
    }
    const bify = createBrowserify(options)

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      optimize(),
      minify({
        'ext': {
          'src': '.js',
          'min': '.js'
        },
        'noSource': true,
        'mangle':   true,
        'compress': true
      }),
      es3ify(),
      flatten(),
      gulp.dest(destination())
    ])
  })

  return merge(bundles)
})

gulp.task('client:js:fast', () => {
  const files = glob.sync(sources.client)

  const bundles = files.map((entry, index) => {
    const options = {
      'entries': [
        entry
      ],
      'debug': true
    }

    if (entry.split('/')[entry.split('/').length - 1] === 'server.js') {
      options.standalone = 'server'
    }
    const bify = createBrowserify(options)

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      flatten(),
      sourcemaps.init({
        'loadMaps': true
      }),
      sourcemaps.write(destination(), {
        'sourceMappingURL': (file) => {
          return `/${file.relative}.map`
        }
      }),
      flatten(),
      gulp.dest(destination())
    ])
  })

  return merge(bundles)
})

gulp.task('client:js:watch', () => {
  const files = glob.sync(sources.client)

  files.map((entry, index) => {
    const options = {
      'entries': [
        entry
      ],
      'debug': true
    }

    if (entry.split('/')[entry.split('/').length - 1] === 'server.js') {
      options.standalone = 'server'
    } else {
      options.plugin = [
        [
          hmr, {
            'mode': 'websocket',
            'port': 3123 + index,
            'url':  `http://localhost:${3123 + index}`
          }
        ]
      ]
    }
    const bify = createBrowserify(options)

    bify.plugin(watchify)

    const bundle = () => {
      return pump([
        prettyError(),
        bify.bundle(),
        source(entry),
        buffer(),
        flatten(),
        sourcemaps.init({
          'loadMaps': true
        }),
        sourcemaps.write(destination(), {
          'sourceMappingURL': (file) => {
            return `/${file.relative}.map`
          }
        }),
        flatten(),
        gulp.dest(destination())
      ])
    }

    const rebundle = () => {
      bundle()
      server.restart()
    }

    bify.on('update', rebundle)
    bify.on('log', gutil.log)
    pubsub.subscribe('finished:vue:pages', rebundle)

    return bundle()
  })
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
      {'src': '/img/openusercss.icon-x16.png', 'sizes': '16x16', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x32.png', 'sizes': '32x32', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x64.png', 'sizes': '64x64', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x128.png', 'sizes': '128x128', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x360.png', 'sizes': '360x360', 'type': 'image/png'},
      {'src': '/img/openusercss.icon-x640.png', 'sizes': '640x640', 'type': 'image/png'}
    ]
  })
  done()
})

gulp.task('client:fast', gulp.parallel(
  gulp.series('client:js:fast', 'client:media:fast'),
  'client:manifest'
))

gulp.task('client:prod', gulp.parallel(
  gulp.series('client:js:prod', 'client:media:prod'),
  'client:manifest'
))
