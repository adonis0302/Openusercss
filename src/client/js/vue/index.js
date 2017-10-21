import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueRouter from 'vue-router'
import VueTooltip from 'v-tooltip'
import VueProgressive from 'vue-progressive-image'

import router from './router'
import store from './store'

import appBase from '../../../../.tmp/app-base/app-base.vue'
import {popperCreate} from '../../components/animations'

export default async () => {
  const vueStart = Date.now()

  Vue.use(VueProgressive, {
    'delay': 2000
  })
  Vue.use(VueRouter)
  Vue.use(VueTooltip, {
    'disposeTimeout':       0,
    'defaultPlacement':     'bottom-center',
    'defaultOffset':        '10px',
    'defaultPopperOptions': {
      'onUpdate': popperCreate
    }
  })
  Vue.use(VeeValidate, {
    'errorBagName':  'errors',
    'fieldsBagName': 'fields',
    'delay':         0,
    'locale':        'en',
    'dictionary':    null,
    'strict':        true,
    'classes':       true,
    'events':        'input|blur',
    'inject':        true,
    'validity':      false,
    'aria':          true
  })

  const app = new Vue({
    store,
    router,
    'el':     'app',
    'render': (handle) => handle(appBase)
  })

  document.querySelector('noscript').remove()

  const perfStats = {
    'name': 'vue',
    'time': Date.now() - vueStart
  }

  return {
    perfStats,
    app
  }
}
