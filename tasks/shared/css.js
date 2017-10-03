const devtools = require('postcss-devtools')
const rucksack = require('rucksack-css')
const material = require('postcss-material-icons')
const flexibility = require('postcss-flexibility')
const fixes = require('postcss-fixes')
const zindex = require('postcss-zindex')
const importUrl = require('postcss-import-url')
const mqpacker = require('css-mqpacker')
const cssnano = require('cssnano')
// const usedcss = require('usedcss')

const postCssPluginsBuild = [
  devtools(),
  mqpacker(),
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false
  }),
  material(),
  importUrl(),
  zindex(),
  fixes(),
  flexibility(),
  cssnano({
    'autoprefixer': {
      'browsers': [ '> 1%' ],
      'add':      true
    }
  })
]

const postCssPluginsWatch = [
  devtools(),
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false
  }),
  material()
]

module.exports = {
  postCssPluginsWatch,
  postCssPluginsBuild
}
