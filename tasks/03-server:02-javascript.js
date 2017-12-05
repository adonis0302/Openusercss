import gulp from 'gulp'
import pump from 'pump'
import glob from 'glob'
import source from 'vinyl-source-stream'
import merge from 'merge-stream'
import prettyError from 'gulp-prettyerror'
import gutil from 'gulp-util'
import flatten from 'gulp-flatten'
import buffer from 'gulp-buffer'
import sourcemaps from 'gulp-sourcemaps'
import minify from 'gulp-minify'
import optimize from 'gulp-optimize-js'
import watchify from 'watchify'
import path from 'path'

import server from './shared/server'
import {createBrowserify} from './shared/js'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

const sources = {
  'server': 'src/*.js'
}

gulp.task('server:prod', (done) => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug':  false,
      'target': 'node'
    })

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
      flatten(),
      gulp.dest(destination())
    ])
  })

  return merge(bundles)
})

gulp.task('server:fast', (done) => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry
      ],
      'debug':  true,
      'target': 'node'
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
      'debug':  true,
      'target': 'node'
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
        sourcemaps.write(destination(), {
          'sourceMappingURL': (file) => {
            return path.resolve(destination(), `${file.relative}.map`)
          }
        }),
        flatten(),
        gulp.dest(destination())
      ]).on('end', () => {
        if (server.child) {
          server.restart()
        }
      })
    }

    bify.on('update', bundle)
    bify.on('log', (content) => {
      gutil.log(`Server: ${content}`)
    })

    return bundle()
  })

  return merge(bundles)
})
