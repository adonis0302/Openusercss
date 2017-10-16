const gulp = require('gulp')

const prettyError = require('gulp-prettyerror')
const pump = require('pump')

const vuemaker = require('gulp-vuemaker')
const manifold = require('gulp-manifold')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const emailEncoder = require('gulp-email-encoder')

const postcss = require('gulp-postcss')
const sassGlob = require('gulp-sass-glob')
const sassVars = require('gulp-sass-vars')
const htmlmin = require('gulp-htmlmin')
const pleeease = require('gulp-pleeease')

const {pugOptions} = require('./shared/pug')
const {postCssPluginsProd, postCssPluginsFast, ourSassConfig} = require('./shared/css')

const sources = [
  'src/client/components/**/*.+(js|scss|pug)'
]

gulp.task('vue:prod', (done) => {
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
          sass(),
          postcss(postCssPluginsProd),
          pleeease({
            'autoprefixer': {
              'browsers': [
                '> 1%',
                'last 4 versions',
                'ios 7'
              ],
              'cascade': true
            },
            'filters': {
              'oldIe': false
            },
            'rem': [
              '16px',
              {
                'replace': true,
                'atrules': true
              }
            ],
            'pseudoElements': true,
            'import':         false,
            'rebaseUrls':     false,
            'minifier':       {
              'removeAllComments': true
            },
            'mqpacker':   true,
            'sourcemaps': false
          })
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

gulp.task('vue:fast', (done) => {
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
          sass(),
          postcss(postCssPluginsFast)
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
