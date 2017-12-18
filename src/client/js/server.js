import 'babel-polyfill'
import {
  Vue,
  store,
  router,
  appBase
} from './vue'

Vue.prototype.$db = {
  getCollection () {
    return {
      find () {
        return []
      },

      findOne () {
        return {}
      }
    }
  }
}

export default (context) => {
  return new Promise((resolve, reject) => {
    const app = new Vue({
      store,
      router,
      ...appBase
    })

    router.push(context.url)

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()

      matchedComponents.forEach((component) => {
        if (component.errorStatus) {
          return reject({
            'code': component.errorStatus
          })
        }
      })

      resolve(app)
    })
  })
}
