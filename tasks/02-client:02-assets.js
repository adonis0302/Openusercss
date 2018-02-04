import gulp from 'gulp'
import pump from 'pump'
import merge from 'merge-stream'
import buffer from 'gulp-buffer'
import filter from 'gulp-filter'
import path from 'path'
import {
  remember,
  cached,
} from './shared/cache'

// IMAGES
import imagemin from 'gulp-imagemin'
import jpegRecompress from 'imagemin-jpeg-recompress'
import jimp from 'gulp-jimp-resize'

// SASS
import sass from 'gulp-sass'
import sassGlob from 'gulp-sass-glob'

// POSTCSS
import postcss from 'gulp-postcss'
import pleeease from 'gulp-pleeease'

// OTHER
import concat from 'gulp-concat'
import webfont64 from 'gulp-base64-webfont-css'
import flatten from 'gulp-flatten'
import {
  iconSizes,
  bgSizes,
  sizes,
  postCssPluginsProd,
  postCssPluginsFunctional,
} from './shared/css'

const sources = {
  'fonts': [
    'node_modules/mdi/fonts/*.woff',
    'src/client/fonts/*.woff',
  ],
  'scss': [
    'src/client/scss/main.scss',
  ],
  'email': [
    'src/client/scss/email.scss',
  ],
  'components': [
    '.tmp/components.min.css',
  ],
  'icons': [
    'src/client/img/*.icon.*',
  ],
  'elements': [
    'src/client/img/**/*',
  ],
  'elementFilter': [
    '**/*.{png,jpg,jpeg,gif}',
    '!**/*.{icon|bg}*',
  ],
  'backgrounds': [
    'src/client/img/**/*.bg.*',
  ],
}

const destination = (dest) => {
  if (!dest) {
    return path.resolve('./build/static/')
  }

  return path.resolve('./build/static/', dest)
}

gulp.task('client:media:prod', (done) => {
  const fontStream = pump([
    gulp.src(sources.fonts),
    webfont64(),
    concat('fonts.scss'),
  ])

  const sassStream = pump([
    gulp.src(sources.scss),
    sassGlob(),
  ])

  const iconStream = pump([
    gulp.src(sources.icons),
    jimp({
      'sizes': iconSizes,
    }),
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    filter(sources.elementFilter),
    jimp({
      sizes,
    }),
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    jimp({
      'sizes': bgSizes,
    }),
  ])

  const finalImageStream = pump([
    merge(backgroundsStream, iconStream, elementStream),
    imagemin([
      imagemin.gifsicle({
        'interlaced':        true,
        'optimizationLevel': 3,
      }),
      jpegRecompress(),
      imagemin.optipng({
        'optimizationLevel': 5,
      }),
      imagemin.svgo({
        'plugins': [
          {
            'removeViewBox': true,
          },
        ],
      }),
    ]),
    flatten(),
    gulp.dest(destination('img')),
  ])

  const finalCssStream = pump([
    merge(fontStream, sassStream, gulp.src(sources.components)),
    sass(),
    buffer(),
    concat('bundle.min.css'),
    pleeease({
      'autoprefixer': {
        'browsers': [
          '> 1%',
          'last 4 versions',
          'ios 7',
        ],
        'cascade': true,
      },
      'filters': {
        'oldIe': false,
      },
      'rem': [
        '16px',
        {
          'replace': true,
          'atrules': true,
        },
      ],
      'pseudoElements': true,
      'import':         false,
      'rebaseUrls':     false,
      'minifier':       {
        'removeAllComments': true,
      },
      'mqpacker':   true,
      'sourcemaps': false,
    }),
    postcss(postCssPluginsProd),
    flatten(),
    gulp.dest(destination('css')),
  ])

  return merge(finalCssStream, finalImageStream)
})

gulp.task('client:media:fast', (done) => {
  const fontStream = pump([
    gulp.src(sources.fonts),
    cached('fonts'),
    webfont64(),
    concat('fonts.scss'),
  ])

  const sassStream = pump([
    gulp.src(sources.scss),
    sassGlob(),
  ])

  const iconStream = pump([
    gulp.src(sources.icons),
    cached('icons'),
    jimp({
      'sizes': iconSizes,
    }),
  ])

  const elementStream = pump([
    gulp.src(sources.elements),
    cached('elements'),
    filter([
      '**/*.{png,jpg,jpeg,gif}',
      '!**/*.bg*',
    ]),
    jimp({
      sizes,
    }),
  ])

  const backgroundsStream = pump([
    gulp.src(sources.backgrounds),
    cached('backgrounds'),
    jimp({
      'sizes': bgSizes,
    }),
  ])

  const finalImageStream = pump([
    merge(backgroundsStream, iconStream, elementStream),
    flatten(),
    merge(
      remember('icons'),
      remember('elements'),
      remember('backgrounds')
    ),
    gulp.dest(destination('img')),
  ])

  const finalCssStream = pump([
    merge(fontStream, sassStream, gulp.src(sources.components)),
    remember('fonts'),
    sass(),
    buffer(),
    concat('bundle.min.css'),
    postcss(postCssPluginsFunctional),
    flatten(),
    gulp.dest(destination('css')),
  ])

  return merge(finalCssStream, finalImageStream)
})

gulp.task('client:media:email', () => {
  return pump([
    gulp.src(sources.email),
    sass(),
    buffer(),
    concat('email.min.css'),
    postcss(postCssPluginsProd),
    flatten(),
    gulp.dest(destination('css')),
  ])
})
