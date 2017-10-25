const gulp = require('gulp')
const pump = require('pump')
const path = require('path')

const babel = require('gulp-babel')
const prettyError = require('gulp-prettyerror')
const minify = require('gulp-minify')

const sources = {
  'manager': [
    'src/manager.js'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('manager:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.manager),
    babel(),
    gulp.dest(destination())
  ])
})

gulp.task('manager:prod', () => {
  return pump([
    prettyError(),
    gulp.src(sources.manager),
    babel(),
    minify({
      'ext': {
        'src': '.js',
        'min': '.js'
      },
      'noSource': true,
      'mangle':   true,
      'compress': true
    }),
    gulp.dest(destination())
  ])
})
