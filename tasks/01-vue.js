const gulp = require('gulp')
const pump = require('pump')

const prettyError = require('gulp-prettyerror')
const vuemaker = require('gulp-vuemaker')
const manifold = require('gulp-manifold')
const sass = require('gulp-sass')
const pug = require('gulp-pug')
const emailEncoder = require('gulp-email-encoder')
const sassGlob = require('gulp-sass-glob')
const sassVars = require('gulp-sass-vars')
const htmlmin = require('gulp-htmlmin')
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const pleeease = require('gulp-pleeease')

const {pugOptions} = require('./shared/pug')
const {
  ourSassConfig,
  postCssPluginsProd,
  postCssPluginsFast
} = require('./shared/css')

const sources = [
  'src/client/components/**/*.+(js|scss|pug)'
]

gulp.task('client:vue:prod', (done) => {
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
            'minifier':       false,
            'mqpacker':       true,
            'sourcemaps':     false
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
    gulp.dest('build/components')
  ]).on('end', () => {
    done()
  })
})

gulp.task('client:vue:fast', (done) => {
  return pump([
    prettyError(),
    gulp.src(sources),
    sourcemaps.init(),
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
    sourcemaps.write(),
    gulp.dest('build/components')
  ]).on('end', () => {
    done()
  })
})

gulp.task('client:vue:watch', (done) => {
  gulp.watch([
    'src/client/components/**/*'
  ], gulp.series('client:vue:fast'))
})
