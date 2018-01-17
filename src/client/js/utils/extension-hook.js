/* eslint no-console:0 */
import hat from 'hat'
import {struct,} from 'superstruct'
import raven from 'raven-js'

const key = hat()
const responseValidator = struct({
  'type':      'string',
  'key':       'string',
  'extension': {
    'name':         'string',
    'version':      'string?',
    'capabilities': [
      'string?',
    ],
  },
})
const questionValidator = struct({
  'type':         'string',
  'key':          'string',
  'revision':     'object',
  'featuresList': {
    'required': [
      'string',
    ],
    'optional': [
      'string',
    ],
  },
})
const featuresList = {
  'required': [
    'install-usercss',
    'configure-after-install',
  ],
  'optional': [
    'install-usercss-event',
    'configure-before-install',
    'builtin-editor',
    'create-usercss',
    'edit-usercss',
    'import-moz-export',
    'export-moz-export',
    'update-manual',
    'update-auto',
    'export-json-backups',
    'import-json-backups',
    'manage-local',
    'search-remote',
    'query-api',
    'mutate-api',
  ],
}

const sendHandshakeQuestion = () => {
  window.postMessage(questionValidator({
    'type':     'ouc-handshake-question',
    'revision': window.revision,
    featuresList,
    key,
  }), '*')
}
const attachHandshakeListeners = () => {
  window.addEventListener('message', (event) => {
    try {
      if (event.data && event.data.type === 'ouc-begin-handshake') {
        sendHandshakeQuestion()
      }

      if (event.data && event.data.type === 'ouc-handshake-response') {
        const response = responseValidator(event.data)
        const missingFeatures = []

        featuresList.required.forEach((feature) => {
          if (!response.extension.capabilities.includes(feature)) {
            missingFeatures.push(feature)
          }
        })

        if (missingFeatures.length) {
          throw new Error([
            `${response.extension.name} ${response.extension.version} is not capable of the following features:`,
            `${missingFeatures.join('\n')}`,
          ].join('\n'))
        }

        if (response.key !== key) {
          throw new Error([
            'Response key doesn\'t match.\n',
            `Expected: ${key}`,
            `Received: ${response.key}`,
            `Raw data: ${JSON.stringify(response, null, 2)}`,
          ].join('\n'))
        }

        process.extension = response.extension
      }
    } catch (error) {
      console.error(error)
      raven.captureException(error)
    }
  })
}

export const runIntegration = async () => {
  attachHandshakeListeners()
  sendHandshakeQuestion()
}
