const gulp = require('gulp')
const path = require('path')
const pump = require('pump')

const prettyError = require('gulp-prettyerror')
const babel = require('gulp-babel')
const minify = require('gulp-minify')

const sources = {
  'shared': [
    'src/shared/**/*.js'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/')
  }

  return path.resolve('./build/', dest)
}

gulp.task('shared:fast', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
    babel(),
    gulp.dest(destination('shared'))
  ])
})

gulp.task('shared:prod', () => {
  return pump([
    prettyError(),
    gulp.src(sources.shared),
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
    gulp.dest(destination('shared'))
  ])
})

gulp.task('shared:watch', () => {
  gulp.watch([
    'src/shared/**/*.js'
  ], gulp.series('shared:fast'))
})
