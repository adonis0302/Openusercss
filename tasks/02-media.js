const gulp = require('gulp')
const pump = require('pump')
const merge = require('merge-stream')
const buffer = require('gulp-buffer')
const filter = require('gulp-filter')
const prettyError = require('gulp-prettyerror')
const path = require('path')

// IMAGES
const imagemin = require('gulp-imagemin')
const jpegRecompress = require('imagemin-jpeg-recompress')
const jimp = require('gulp-jimp-resize')

// SASS
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const sassVars = require('gulp-sass-vars')

// POSTCSS
const postcss = require('gulp-postcss')
const pleeease = require('gulp-pleeease')

// OTHER
const concat = require('gulp-concat')
const webfont64 = require('gulp-base64-webfont-css')
const size = require('gulp-size')
const del = require('del')
const flatten = require('gulp-flatten')

const {
  iconSizes,
  bgSizes,
  sizes,
  ourSassConfig,
  postCssPluginsProd,
  postCssPluginsFast
} = require('./shared/css')

// =============================================================================
// SCSS -> CSS and OPTIMIZE IMGs
// =============================================================================

const sources = {
  'fonts': [
    'node_modules/mdi/fonts/*.woff',
    'src/client/fonts/*.woff'
  ],
  'sass': [
    'src/client/scss/main.scss'
  ],
  'icons': [
    'src/client/img/*.icon.*'
  ],
  'elements': [
    'src/client/img/**/*'
  ],
  'elementFilter': [
    '**/*.{png,jpg,jpeg,gif}',
    '!**/*.{icon|bg}*'
  ],
  'backgrounds': [
    'src/client/img/**/*.bg.*'
  ]
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/client/')
  }

  return path.resolve('./build/client/', dest)
}

gulp.task('client:media:prod', () => {
  del.sync(destination('css'))
  del.sync(destination('img'))

  const fontStream = pump([
    gulp.src(sources.fonts),
    webfont64(),
    concat('fonts.scss')
  ])

  const sassStream = pump([
    gulp.src(sources.sass),
    sassGlob()
  ])

  const iconStream = pump([
    gulp.src(sources.icons),
    jimp({
      'sizes': iconSizes
    })
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    filter(sources.elementFilter),
    jimp({
      sizes
    })
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    jimp({
      'sizes': bgSizes
    })
  ])

  const finalImageStream = pump([
    prettyError(),
    merge(backgroundsStream, iconStream, elementStream),
    imagemin([
      imagemin.gifsicle({
        'interlaced':        true,
        'optimizationLevel': 3
      }),
      jpegRecompress(),
      imagemin.optipng({
        'optimizationLevel': 5
      }),
      imagemin.svgo({
        'plugins': [
          {
            'removeViewBox': true
          }
        ]
      })
    ]),
    flatten(),
    size(),
    gulp.dest(destination('img'))
  ])

  const finalCssStream = pump([
    prettyError(),
    merge(fontStream, sassStream),
    sassVars(ourSassConfig, {
      'verbose': false
    }),
    sass(),
    buffer(),
    concat('bundle.min.css'),
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
    }),
    flatten(),
    size(),
    gulp.dest(destination('css'))
  ])

  return merge(finalCssStream, finalImageStream)
})

gulp.task('client:media:fast', () => {
  del.sync(destination('css'))
  del.sync(destination('img'))

  const fontStream = pump([
    gulp.src(sources.fonts),
    webfont64(),
    concat('fonts.scss')
  ])

  const sassStream = pump([
    gulp.src(sources.sass),
    sassGlob()
  ])

  const iconStream = pump([
    gulp.src(sources.icons),
    jimp({
      'sizes': iconSizes
    })
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    filter([
      '**/*.{png,jpg,jpeg,gif}',
      '!**/*.bg*'
    ]),
    jimp({
      sizes
    })
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    jimp({
      'sizes': bgSizes
    })
  ])

  const finalImageStream = pump([
    prettyError(),
    merge(backgroundsStream, iconStream, elementStream),
    size(),
    flatten(),
    gulp.dest(destination('img'))
  ])

  const finalCssStream = pump([
    prettyError(),
    merge(fontStream, sassStream),
    sassVars(ourSassConfig, {
      'verbose': false
    }),
    sass(),
    buffer(),
    concat('bundle.min.css'),
    postcss(postCssPluginsFast),
    flatten(),
    size(),
    gulp.dest(destination('css'))
  ])

  return merge(finalCssStream, finalImageStream)
})

gulp.task('client:media:watch', (done) => {
  gulp.watch([
    'src/client/{fonts|img|scss}/**/*'
  ], gulp.parallel('client:media:fast', 'client:vue:fast'))
})
