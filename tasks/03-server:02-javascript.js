import gulp from 'gulp'
import pump from 'pump'
import glob from 'glob'
import source from 'vinyl-source-stream'
import merge from 'merge-stream'
import gutil from 'gulp-util'
import watchify from 'watchify'
import path from 'path'

import server from './shared/server'
import {createBrowserify,} from './shared/js'

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

const sources = {
  'server': 'src/*.js',
}

gulp.task('server:prod', (done) => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry,
      ],
      'debug':  false,
      'target': 'node',
    })

    return pump([
      bify.bundle(),
      source(entry.split('/').reverse()[0]),
      gulp.dest(destination()),
    ])
  })

  return merge(bundles)
})

gulp.task('server:fast', (done) => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry,
      ],
      'debug':  true,
      'target': 'node',
    })

    return pump([
      bify.bundle(),
      source(entry.split('/').reverse()[0]),
      gulp.dest(destination()),
    ])
  })

  return merge(bundles)
})

gulp.task('server:watch', () => {
  const files = glob.sync(sources.server)

  const bundles = files.map((entry, index) => {
    const bify = createBrowserify({
      'entries': [
        entry,
      ],
      'debug':  true,
      'target': 'node',
    })

    bify.plugin(watchify)

    const bundle = () => {
      return pump([
        bify.bundle(),
        source(entry.split('/').reverse()[0]),
        gulp.dest(destination()),
      ]).on('end', () => {
        if (server.child) {
          server.restart()
        }
      })
    }

    bify.on('update', bundle)
    bify.on('log', (content) => {
      gutil.log(`Server (${entry}): ${content}`)
    })

    return bundle()
  })

  return merge(bundles)
})
