/* eslint-disable no-console */
import Vue from 'vue'
import hat from 'hat'

import pkg from '~/../package.json'
import {project, data, cute,} from '~/../.ignored/meta.json'

Vue.prototype.$pkg = pkg

if (process.client) {
  if (typeof window.console !== 'undefined' && window.console === console) {
    const showBuffer = (input) => Buffer.from(input.split('').reverse().join(''), 'base64')
    const showStringFor = (input) => input.toString('ascii').split('').reverse().join('')

    try {
      const run = () => {
        const key = hat()
        const notCute = Math.floor(Math.random() * 5)
        const state = JSON.parse(window.localStorage.getItem(`ouc-state-${pkg.version}`))
        let user = null

        if (
          state !== null
          && 'session' in state && state.session !== null
          && 'viewer' in state.session && state.session.viewer !== null
          && 'displayname' in state.session.viewer && state.session.viewer.displayname !== null
        ) {
          user = state.session.viewer.displayname
        }

        const listenArray = [
          showStringFor(showBuffer(project[1])),
        ]
        const listenStyleArray = [
          [
            'color: #D80B00;',
            'font-weight: 700;',
          ].join(''),
        ]
        const showCute = () => {
          return showStringFor(showBuffer(cute[0]))
        }

        if (notCute) {
          if (user) {
            console.log(`${showStringFor(showBuffer(project[0]))}, ${user}`,
              [
                'color: #D80B00;',
                'font-weight: 700;',
              ].join(''),
            )
          } else {
            console.log(showStringFor(showBuffer(project[0])),
              [
                'color: #D80B00;',
                'font-weight: 700;',
              ].join(''),
            )
          }

          listenArray.push(showCute())
          listenStyleArray.push([
            'color: #FFBDE1;',
            'font-weight: 700;',
          ].join(''))
        } else {
          listenArray.push(` ${key}`)
          const handler = (event) => {
            console.table(showStringFor(showBuffer(data[0])).split(' '))
            window.removeEventListener(key, handler)
          }

          window.addEventListener(key, handler)
        }

        console.log(listenArray.join(''), ...listenStyleArray)
      }

      const check = /./

      check.toString = () => {
        try {
          run()
        } catch (error) {
          console.error(error)
        }

        return [
          'color: #D80B00;',
          'font-weight: 700;',
        ].join('')
      }
      console.log(showStringFor(showBuffer(project[2])), check)
    } catch (error) {
      console.error(error)
    }
  }
}
