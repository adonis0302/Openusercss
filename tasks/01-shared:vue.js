import gulp from 'gulp'
import pump from 'pump'
import prettyError from 'gulp-prettyerror'
import vuemaker from 'gulp-vuemaker'
import manifold from 'gulp-manifold'
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import emailEncoder from 'gulp-email-encoder'
import sassGlob from 'gulp-sass-glob'
import sassVars from 'gulp-sass-vars'
import htmlmin from 'gulp-htmlmin'
import sourcemaps from 'gulp-sourcemaps'
import postcss from 'gulp-postcss'
import pleeease from 'gulp-pleeease'
import {pugOptions} from './shared/pug'
import {ourSassConfig, postCssPluginsProd, postCssPluginsFast} from './shared/css'

const sources = [
  'src/components/**/*.+(js|scss|pug)'
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
    'src/components/**/*'
  ], gulp.series('client:vue:fast'))
})
