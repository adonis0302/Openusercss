import 'babel-polyfill'
import {
  Vue,
  store,
  router,
  appBase,
  mixins,
} from './utils/vue'
import db from './store/db'
import raven from 'raven-js'
import ravenVue from 'raven-js/plugins/vue'

if (process.env.NODE_ENV !== 'development') {
  raven.config('https://f2b28215968745f0a2fdfabccb8e1172@sentry.io/264729')
  .addPlugin(ravenVue, Vue)
  .install()
}

Vue.prototype.$db = db

export default (context) => {
  return new Promise((resolve, reject) => {
    const app = new Vue({
      store,
      router,
      mixins,
      ...appBase,
    })

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      matchedComponents.forEach((component) => {
        if (component.errorStatus) {
          return reject({
            'code': component.errorStatus,
          })
        }
      })

      resolve(app)
    })
  })
}
