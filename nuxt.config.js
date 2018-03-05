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

const dev = process.env.NODE_ENV === 'development'
const ci = process.env.CI
const analyze = dev && !ci

module.exports = {
  'srcDir': './app',
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
    '~/scss/main.scss',
  ],
  'plugins': [
    '~/plugins/vue-moment',
    '~/plugins/vue-markdown',
    '~/plugins/vue-filters',
    '~/plugins/vue-modal',
    '~/plugins/vee-validate',
    '~/plugins/extension-data',
  ],
  'modules': [
    [
      '@nuxtjs/pwa', {
        'manifest': {
          'name':             'OpenUserCSS',
          'short_name':       'OpenUserCSS',
          'description':      'Themes for your favourite websites',
          'display':          'standalone',
          'theme_color':      '#005FFF',
          'background_color': '#3E28B0',
          'start_url':        '/?utm_source=homescreen',
          'lang':             'en',
          'icons':            [
            {
              'src':   '/img/openusercss.icon-x16.png',
              'sizes': '16x16',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x32.png',
              'sizes': '32x32',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x64.png',
              'sizes': '64x64',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x128.png',
              'sizes': '128x128',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x360.png',
              'sizes': '360x360',
              'type':  'image/png',
            },
            {
              'src':   '/img/openusercss.icon-x640.png',
              'sizes': '640x640',
              'type':  'image/png',
            },
          ],
        },
      },
    ],
    [
      'nuxt-fontawesome', {
        'component': 'fa-icon',
        'imports':   [
          {
            'set': '@fortawesome/fontawesome-free-solid',
          },
        ],
      },
    ],
  ],
  'build': {
    analyze,
    postcss,
  },
}
