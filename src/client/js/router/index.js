import VueRouter from 'vue-router'
import store from '../store'

import indexRoute from '../../../../.tmp/pages/index/index.vue'
import searchRoute from '../../../../.tmp/pages/search/search.vue'
import loginRoute from '../../../../.tmp/pages/login/login.vue'
import registerRoute from '../../../../.tmp/pages/register/register.vue'
import verifyEmailRoute from '../../../../.tmp/pages/verify-email/verify-email.vue'
import profileRoute from '../../../../.tmp/pages/profile/profile.vue'
import themeEditorRoute from '../../../../.tmp/pages/edit-theme/edit-theme.vue'
import themeRoute from '../../../../.tmp/pages/theme/theme.vue'
import contactRoute from '../../../../.tmp/pages/contact/contact.vue'
import testRoute from '../../../../.tmp/pages/test/test.vue'
import accountRoute from '../../../../.tmp/pages/account/account.vue'

import notFoundRoute from '../../../../.tmp/pages/not-found/not-found.vue'

export const routerOptions = {
  'mode':   'history',
  'routes': [
    {
      'path':      '/',
      'component': indexRoute,
      beforeEnter (to, from, next) {
        store.dispatch('getLatestThemes', 6)
        .then(next)
        .catch(next)
      }
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
      'path':      '/account',
      'component': accountRoute
    },
    {
      'path':      '/verify-email/:token',
      'component': verifyEmailRoute
    },
    {
      'path':      '/search/:terms?',
      'component': searchRoute
    },
    {
      'path':      '/contact',
      'component': contactRoute
    },
    {
      'path':      '/profile/:id',
      'component': profileRoute,
      beforeEnter (to, from, next) {
        store.dispatch('getFullUser', to.params.id)
        .then(next)
        .catch(next)
      }
    },
    {
      'path':      '/theme/edit/:id?',
      'component': themeEditorRoute,
      beforeEnter (to, from, next) {
        if (!to.params.id) {
          return next()
        }

        return store.dispatch('getFullTheme', to.params.id)
        .then(next)
        .catch(next)
      }
    },
    {
      'path':      '/theme/:id/:options?',
      'component': themeRoute,
      beforeEnter (to, from, next) {
        store.dispatch('getFullTheme', to.params.id)
        .then(next)
        .catch(next)
      }
    },
    {
      'path':      '/test',
      'component': testRoute
    },
    {
      'path':      '*',
      'component': notFoundRoute
    }
  ]
}
const router = new VueRouter(routerOptions)

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
