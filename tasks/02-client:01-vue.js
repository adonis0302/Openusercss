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
import {ourSassConfig, postCssPluginsFunctional, postCssPluginsProdComponents} from './shared/css'

const sources = {
  'components': [
    'src/components/bits/**/*.+(js|scss|pug)',
    'src/components/elements/**/*.+(js|scss|pug)',
    'src/components/sets/**/*.+(js|scss|pug)'
  ],
  'pages': [
    'src/components/pages/**/*.+(js|scss|pug)'
  ]
}

gulp.task('shared:components:prod', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.components),
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
          }),
          postcss(postCssPluginsProdComponents)
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
    gulp.dest('.tmp/components')
  ]).on('end', done)
})

gulp.task('shared:components:fast', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.components),
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
          postcss(postCssPluginsFunctional)
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
    gulp.dest('.tmp/components')
  ]).on('end', done)
})

gulp.task('shared:pages:prod', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.pages),
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
          }),
          postcss(postCssPluginsProdComponents)
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
    gulp.dest('.tmp/pages')
  ]).on('end', done)
})

gulp.task('shared:pages:fast', (done) => {
  pump([
    prettyError(),
    gulp.src(sources.pages),
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
          postcss(postCssPluginsFunctional)
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
    gulp.dest('.tmp/pages')
  ]).on('end', done)
})
