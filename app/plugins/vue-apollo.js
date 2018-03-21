import Vue from 'vue'
import VueApollo from 'vue-apollo'

import defaultClient from '~/../lib/apollo-client'

export default async (context, inject) => {
  const apolloProvider = new VueApollo({
    defaultClient,
    'ssr': process.server,
  })

  Vue.use(VueApollo)
  context.app.provide = apolloProvider.provide()

  if (process.server) {
    context.beforeNuxtRender(async ({Components, nuxtState,}) => {
      Components.forEach((Component) => {
        if (Component.options && Component.options.apollo && Component.options.apollo.$init) {
          Reflect.deleteProperty(Component.options.apollo, '$init')
        }
      })

      await apolloProvider.prefetchAll(context, Components)
      nuxtState.apollo = apolloProvider.getStates()
    })
  }
}
