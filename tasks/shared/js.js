const babelOptions = {
  'presets': [
    'vue',
    'flow',
    [
      'env', {
        'targets': {
          'node':     '4',
          'browsers': [
            'last 4 versions'
          ]
        }
      }
    ],
    'stage-3'
  ]
}

const uglifyOptions = {
  'ie8': true
}

module.exports = {
  babelOptions,
  uglifyOptions
}
