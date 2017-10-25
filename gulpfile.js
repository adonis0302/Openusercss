/* eslint no-console:0 no-process-env:0 */
const requireDir = require('require-dir')
const handler = require('./src/shared/error-handler')

handler()

if (!process.env.NODE_ENV) {
  throw new Error('No NODE_ENV environment variable')
}

requireDir('./tasks/', {
  'recurse': true
})
