/* eslint no-process-env:0 */
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

export default babelOptions
