import 'babel-polyfill'
import {app, router} from './vue'

export default (context) => {
  return new Promise((resolve) => {
    router.push(context.url)

    router.onReady(() => {
      resolve(app)
    })
  })
}
