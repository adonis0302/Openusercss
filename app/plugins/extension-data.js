/* eslint no-console:0 */
import Vue from 'vue'

import hat from 'hat'
import {struct,} from 'superstruct'
import raven from 'raven-js'

let extension = null

if (process.client) {
  const key = hat()
  const extensionValidator = struct({
    'name':         'string',
    'version':      'string?',
    'icon':         'string?',
    'colour':       'string?',
    'capabilities': [
      'string?',
    ],
  }, {
    'colour': '#005FFF',
    'icon':   'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NzYgNTEyIj4gIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01MTkgMjg5Yy00MSAwLTU5IDMxLTgyIDMxLTYwIDAtNS0xNzYtNS0xNzZzLTE5NiA4MC0xOTYtM2MwLTM2IDM2LTQ3IDM2LTg2IDAtMzYtMjgtNTUtNjEtNTUtMzUgMC02NyAxOS02NyA1NiAwIDQyIDMyIDYwIDMyIDgyIDAgNzAtMTc2IDI5LTE3NiAyOXYzMzNzMTc5IDQxIDE3OS0yOWMwLTIyLTQwLTQwLTQwLTgxIDAtMzggMjktNTYgNjMtNTZzNjIgMTkgNjIgNTRjMCA0MC0zNiA1MC0zNiA4NiAwIDYxIDEyOSAyNiAxODEgMjYgMCAwLTM1LTEyMCAyNi0xMjAgMzYgMCA0NiAzNiA4NiAzNiAzNiAwIDU1LTI4IDU1LTYycy0xOS02NS01Ny02NXoiLz48L3N2Zz4=',
  })
  const responseValidator = struct({
    'type':      'string',
    'key':       'string',
    'extension': extensionValidator,
  })
  const questionValidator = struct({
    'type':         'string',
    'key':          'string',
    'revision':     'object?',
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
      'event:install-usercss',
      'event:is-installed',
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
    try {
      window.postMessage(questionValidator({
        'type': 'ouc-handshake-question',
        featuresList,
        key,
      }), '*')
    } catch (error) {
      console.error('Failed to send handshake question -', error)
    }
  }
  const attachHandshakeListeners = () => {
    window.addEventListener('message', (event) => {
      try {
        if (event.data && event.data.type === 'ouc-begin-handshake') {
          sendHandshakeQuestion()
        }

        if (event.data && event.data.type === 'ouc-handshake-response') {
          const response = responseValidator(event.data)

          if (
            window.atob(window.btoa(response.extension.icon)) !== response.extension.icon
            || !response.extension.icon.startsWith('data:image/')
          ) {
            throw new Error('Icon must be a base64 encoded image')
          }

          const missingFeatures = []

          featuresList.required.forEach((feature) => {
            if (!response.extension.capabilities.includes(feature)) {
              missingFeatures.push(feature)
            }
          })

          if (missingFeatures.length > 0) {
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

          extension = response.extension
        }
      } catch (error) {
        console.error(error)
        raven.captureException(error)
      }
    })
  }

  attachHandshakeListeners()
  sendHandshakeQuestion()
}

Vue.mixin({
  data () {
    return {
      extension,
    }
  },
  mounted () {
    setTimeout(() => {
      this.extension = extension
    })
  },
})
