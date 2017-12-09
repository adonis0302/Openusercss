import VueRouter from 'vue-router'

import indexRoute from '../../../../.tmp/pages/index/index.vue'
import searchRoute from '../../../../.tmp/pages/search/search.vue'
import loginRoute from '../../../../.tmp/pages/login/login.vue'
import registerRoute from '../../../../.tmp/pages/register/register.vue'
import profileRoute from '../../../../.tmp/pages/profile/profile.vue'
import themeEditorRoute from '../../../../.tmp/pages/edit-theme/edit-theme.vue'
import themeRoute from '../../../../.tmp/pages/theme/theme.vue'
import contactRoute from '../../../../.tmp/pages/contact/contact.vue'

import notFoundRoute from '../../../../.tmp/pages/not-found/not-found.vue'

const router = new VueRouter({
  'mode':   'history',
  'routes': [
    {
      'path':      '/',
      'component': indexRoute
    },
    {
      'path':      '/login',
      'component': loginRoute
    },
    {
      'path':      '/register',
      'component': registerRoute
    },
    {
      'path':      '/search',
      'component': searchRoute
    },
    {
      'path':      '/search/:terms',
      'component': searchRoute
    },
    {
      'path':      '/contact',
      'component': contactRoute
    },
    {
      'path':      '/profile/:id',
      'component': profileRoute
    },
    {
      'path':      '/theme/edit/:id',
      'component': themeEditorRoute
    },
    {
      'path':      '/theme/:id',
      'component': themeRoute
    },
    {
      'path':      '*',
      'component': notFoundRoute
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (
    process.browser
    && 'serviceWorker' in navigator
    && navigator.serviceWorker.controller
    && 'MessageChannel' in window
  ) {
    const {port2} = new window.MessageChannel()

    navigator.serviceWorker.controller.postMessage({
      'action': 'cache-route',
      'route':  to.path
    }, [
      port2
    ])
  }

  next()
})

export default router
