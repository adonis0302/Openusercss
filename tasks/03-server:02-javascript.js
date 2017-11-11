import gulp from 'gulp'
import pump from 'pump'
import glob from 'glob'
import source from 'vinyl-source-stream'
import merge from 'merge-stream'
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
import babel from 'gulp-babel'
import vueify from 'vueify'
import babelify from 'babelify'
import path from 'path'
import envify from 'loose-envify'
import server from './shared/server'
import babelOptions from './shared/js'
import emitter from './shared/bus'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

const browserifyOpts = (mergeWith) => {
  const options = {
    ...mergeWith,
    'bundleExternal': false,
    'standalone':     'server',
    'extensions':     [
      '.js'
    ],
    'fullPaths':    false,
    'cache':        {},
    'packageCache': {},
    'transform':    [
      [
        envify, {
          // eslint-disable-next-line
          'NODE_ENV': process.env.NODE_ENV || 'development'
        }
      ]
    ]
  }

  return options
}

const sources = {
  'server': 'src/*.js'
}

const createBrowserify = ({entries, debug}) => {
  const bify = browserify(browserifyOpts({
    entries,
    debug
  }))

  bify.transform(vueify)
  bify.transform(babelify)

  return bify
}

gulp.task('server:prod', () => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': false
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      buffer(),
      optimize(),
      babel(babelOptions),
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

gulp.task('server:fast', () => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': true
    })

    return pump([
      prettyError(),
      bify.bundle(),
      source(entry),
      flatten(),
      buffer(),
      sourcemaps.init({
        'loadMaps': true
      }),
      babel(babelOptions),
      sourcemaps.write(destination(), {
        'sourceMappingURL': (file) => {
          return path.resolve(destination(), `${file.relative}.map`)
        }
      }),
      flatten(),
      gulp.dest(destination())
    ])
  })

  return merge(bundles)
})

gulp.task('server:watch', () => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug': true
    })

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
        babel(babelOptions),
        sourcemaps.write(destination(), {
          'sourceMappingURL': (file) => {
            return path.resolve(destination(), `${file.relative}.map`)
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
    emitter.on('rebundle', rebundle)

    return bundle()
  })

  return merge(bundles)
})
