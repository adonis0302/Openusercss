/* eslint no-process-env:0 */
import envify from 'loose-envify'

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
  ],
  'transform': [
    [
      envify, {
        'NODE_ENV': process.env.NODE_ENV || 'development'
      }
    ]
  ]
}

export default {
  babelOptions
}
