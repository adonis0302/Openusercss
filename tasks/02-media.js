/* eslint no-console:0 */
const gulp = require('gulp')
const pump = require('pump')
const merge = require('merge-stream')
const gulpif = require('gulp-if')
const sourcemaps = require('gulp-sourcemaps')
const buffer = require('gulp-buffer')
const filter = require('gulp-filter')
const save = require('gulp-save')
const rename = require('gulp-rename')
const prettyError = require('gulp-prettyerror')

// IMAGES
const imagemin = require('gulp-imagemin')
const responsive = require('gulp-responsive')
const jpegRecompress = require('imagemin-jpeg-recompress')
// SASS
const sass = require('gulp-sass')
const sassGlob = require('gulp-sass-glob')
const sassVars = require('gulp-sass-vars')
const spritesmith = require('gulp.spritesmith-multi')
// POSTCSS
const postcss = require('gulp-postcss')
const pleeease = require('gulp-pleeease')
// OTHER
const concat = require('gulp-concat')
const googleFonts = require('gulp-google-fonts')
const webfont64 = require('gulp-base64-webfont-css')

const {
  clyConfig,
  iconSizesPx,
  bgSizesPx,
  ourSassConfig
} = require('./appshell')

// =============================================================================
// SCSS -> CSS and IMG => SPRITES
// =============================================================================

const {postCssPluginsBuild, postCssPluginsWatch} = require('./shared/css')

const resizerOptions = {
  'skipOnEnlargement':  true,
  'withoutEnlargement': true,
  'errorOnEnlargement': false,
  'stats':              true
}
const sizes = []

clyConfig.get('image-widths').forEach((width) => {
  sizes.push({
    'rename': {
      'suffix': `-x${width}`
    },
    width
  })
})

const iconSizes = []

iconSizesPx.forEach((iconSize) => {
  iconSizes.push({
    'rename': {
      'suffix': `-x${iconSize}`
    },
    'width': iconSize
  })
})

const bgSizes = []

bgSizesPx.forEach((bgSize) => {
  bgSizes.push({
    'rename': {
      'suffix':  `-x${bgSize}`,
      'extname': '.jpg'
    },
    'quality': 85,
    'width':   bgSize,
    'format':  'jpeg'
  })
})

const mediaTaskWatch = () => {
  const out = 'build/public/css/'

  const sassStream = pump([
    prettyError(),
    sourcemaps.init(),
    gulp.src([
      'src/public/scss/main.scss',
      '.tmp/fonts.scss'
    ]),
    sassGlob(),
    sassVars(ourSassConfig, {
      'verbose': true
    }),
    sass()
  ])

  const iconStream = pump([
    gulp.src([
      'src/public/img/*.icon.*'
    ]),
    responsive({
      '*': iconSizes
    }, resizerOptions)
  ])

  const elementStream = pump([
    gulp.src([
      'src/public/img/*'
    ]),
    filter([
      '**/*.{png,jpg,jpeg,gif}',
      '!**/*.bg*'
    ]),
    responsive({
      '*': sizes
    }, resizerOptions),
    spritesmith({
      'spritesmith': (spriteOpts) => {
        spriteOpts.imgPath = `../img/${spriteOpts.imgName}`
        spriteOpts.cssName = `${spriteOpts.cssName.split('.')[0]}.css`
        spriteOpts.cssSpritesheetName = `${spriteOpts.cssName.split('.')[0]}`
        spriteOpts.cssTemplate = spritesmith.util.createTemplate('src/public/sprites.hbs', spritesmith.util.addPseudoClass)
      }
    })
  ])

  const backgroundsStream = pump([
    gulp.src([
      'src/public/img/**/*.bg.*'
    ]),
    responsive({
      '*': bgSizes
    }, resizerOptions)
  ])

  const finalImageStream = pump([
    prettyError(),
    merge(iconStream, elementStream, backgroundsStream),
    buffer(),
    gulpif('!*.css', gulp.dest('build/public/img'))
  ])

  const spriteCssStream = pump([
    sourcemaps.init(),
    elementStream.css
  ])

  const finalCssStream = pump([
    prettyError(),
    merge(sassStream, spriteCssStream),
    concat('bundle.min.css'),
    buffer(),
    postcss(postCssPluginsWatch),
    sourcemaps.write('.'),
    gulp.dest(out)
  ])

  return merge(finalCssStream, finalImageStream)
}

const mediaTaskBuild = () => {
  const out = 'build/public/css/'

  const sassStream = pump([
    prettyError(),
    gulp.src([
      'src/public/scss/main.scss',
      '.tmp/fonts.scss'
    ]),
    sassGlob(),
    sassVars(ourSassConfig, {
      'verbose': false
    }),
    sass()
  ])

  const iconStream = pump([
    gulp.src([
      'src/public/img/*'
    ]),
    filter('**/*.icon.png'),
    responsive({
      '*': iconSizes
    }, resizerOptions)
  ])

  const elementStream = pump([
    gulp.src([
      'src/public/img/*'
    ]),
    filter([
      '**/*.{png,jpg,jpeg,gif}',
      '!**/*.bg*'
    ]),
    responsive({
      '*': sizes
    }, resizerOptions),
    spritesmith({
      'spritesmith': (spriteOpts) => {
        spriteOpts.imgPath = `../img/${spriteOpts.imgName}`
        spriteOpts.cssName = `${spriteOpts.cssName.split('.')[0]}.css`
        spriteOpts.cssSpritesheetName = `${spriteOpts.cssName.split('.')[0]}`
        spriteOpts.cssTemplate = spritesmith.util.createTemplate('src/public/sprites.hbs', spritesmith.util.addPseudoClass)
      }
    })
  ])

  const backgroundsStream = pump([
    gulp.src([
      'src/public/img/*'
    ]),
    filter('**/*.bg*'),
    responsive({
      '*': bgSizes
    }, resizerOptions)
  ])

  const finalImageStream = pump([
    prettyError(),
    merge(iconStream, elementStream, backgroundsStream),
    buffer(),
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
    gulpif('!*.css', gulp.dest('build/public/img'))
  ])

  const finalCssStream = pump([
    prettyError(),
    merge(sassStream, elementStream.css),
    concat('bundle.min.css'),
    buffer(),
    pleeease(),
    postcss(postCssPluginsBuild),

    save('before-ie'),
    rename('bundle.ie.css'),
    gulp.dest(out),

    save.restore('before-ie'),
    gulp.dest(out)
  ])

  return merge(finalCssStream, finalImageStream)
}

gulp.task('fonts', () => {
  const googleFontStream = pump([
    gulp.src('fonts.neon'),
    googleFonts(),
    concat('googleFonts.scss')
  ])

  const localFontStream = pump([
    gulp.src('node_modules/mdi/fonts/*.woff'),
    webfont64(),
    concat('localFonts.scss')
  ])

  return pump([
    merge(googleFontStream, localFontStream),
    concat('fonts.scss'),
    gulp.dest('./.tmp')
  ])
})

gulp.task('media-build', gulp.series('fonts', mediaTaskBuild))
gulp.task('media-watch', gulp.series('fonts', mediaTaskWatch))
