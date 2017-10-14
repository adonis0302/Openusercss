const devtools = require('postcss-devtools')
const rucksack = require('rucksack-css')
const flexibility = require('postcss-flexibility')
const fixes = require('postcss-fixes')
const zindex = require('postcss-zindex')
const importUrl = require('postcss-import-url')
const mqpacker = require('css-mqpacker')
const cssnano = require('cssnano')

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
  importUrl()
]

module.exports = {
  postCssPluginsWatch,
  postCssPluginsBuild
}
