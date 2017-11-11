import 'babel-polyfill'
import {app, router} from './vue'

export default async (context) => {
  router.push(context.url)
  return app
}
