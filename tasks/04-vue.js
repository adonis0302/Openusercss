const gulp = require('gulp')

const prettyError = require('gulp-prettyerror')
const pump = require('pump')

const vuemaker = require('gulp-vuemaker')
const manifold = require('gulp-manifold')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const emailEncoder = require('gulp-email-encoder')

// const pleeease = require('gulp-pleeease')
// const postcss = require('gulp-postcss')
const sassGlob = require('gulp-sass-glob')
const sassVars = require('gulp-sass-vars')
const htmlmin = require('gulp-htmlmin')

const {pugOptions} = require('./shared/pug')
// const {postCssPluginsBuild, postCssPluginsWatch} = require('./shared/css')
const {ourSassConfig} = require('./appshell')

const sources = [
  'src/public/components/**/*.+(js|scss|pug)'
]

gulp.task('vue-watch', (done) => {
  return pump([
    prettyError(),
    gulp.src(sources),
    manifold({
      '**/*.scss': (stream) => {
        return pump([
          prettyError(),
          stream,
          sassGlob(),
          sassVars(ourSassConfig, {
            'verbose': true
          }),
          sass()
        ])
      },

      '**/*.pug': (stream) => {
        return pump([
          prettyError(),
          stream,
          pug(pugOptions)
        ])
      }
    }),
    vuemaker(),
    gulp.dest('.tmp')
  ]).on('end', () => {
    done()
  })
})

gulp.task('vue-build', (done) => {
  return pump([
    prettyError(),
    gulp.src(sources),
    manifold({
      '**/*.scss': (stream) => {
        return pump([
          prettyError(),
          stream,
          sassGlob(),
          sassVars(ourSassConfig, {
            'verbose': false
          }),
          sass()
        ])
      },

      '**/*.pug': (stream) => {
        return pump([
          prettyError(),
          stream,
          pug(pugOptions),
          emailEncoder(),
          htmlmin({
            'collapseWhitespace': true,
            'minifyCss':          true,
            'minifyJs':           true,
            'keepClosingSlash':   true,
            'removeComments':     true
          })
        ])
      }
    }),
    vuemaker(),
    gulp.dest('.tmp')
  ]).on('end', () => {
    done()
  })
})
