const rucksack = require('rucksack-css')
const flexibility = require('postcss-flexibility')
const willChange = require('postcss-will-change')
const willChangeTransition = require('postcss-will-change-transition')
const ellipsis = require('postcss-ellipsis')

const postcss = [
  // Syntax extending plugins
  rucksack({
    'autoprefixer':      false,
    'shorthandPosition': false,
    'quantityQueries':   false,
    'alias':             false,
    'inputPseudo':       false,
  }),
  ellipsis(),
  // Zero-effort feature adding plugins
  flexibility(),
  willChange(),
  willChangeTransition(),
]

module.exports = {
  'srcDir': './src',
  'head':   {
    'titleTemplate': '%s - OpenUserCSS',
    'meta':          [
      {'charset': 'utf-8',},
      {'name': 'viewport', 'content': 'width=device-width, initial-scale=1',},
    ],
  },
  'loading': {
    'color':       '#FFB450',
    'failedColor': '#D80B00',
    'height':      '3px',
  },
  'css': [
    '~/client/scss/main.scss',
  ],
  'plugins': [
    '~/plugins/vue-moment',
    '~/plugins/vue-markdown',
    '~/plugins/vue-filters',
    '~/plugins/vue-modal',
    '~/plugins/vee-validate',
    '~/plugins/extension-data',
    '~/plugins/material-icons',
  ],
  'build': {
    postcss,
  },
}
