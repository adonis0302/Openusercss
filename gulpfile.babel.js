/* eslint no-console:0 no-process-env:0 */
import 'babel-polyfill'
import requireDir from 'require-dir'
import {auto} from './src/shared/error-handler'

auto()

if (!process.env.NODE_ENV) {
  throw new Error('No NODE_ENV environment variable')
}

requireDir('./tasks/', {
  'recurse': true
})
