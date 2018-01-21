import VueRouter from 'vue-router'
import raven from 'raven-js'
import store from '../store'
import {getTheme, getUser,} from './vue'

import indexRoute from '../../../components/pages/index.vue'
import searchRoute from '../../../components/pages/search.vue'
import loginRoute from '../../../components/pages/login.vue'
import registerRoute from '../../../components/pages/register.vue'
import verifyEmailRoute from '../../../components/pages/verify-email.vue'
import profileRoute from '../../../components/pages/profile.vue'
import themeEditorRoute from '../../../components/pages/edit-theme.vue'
import themeRoute from '../../../components/pages/theme.vue'
import contactRoute from '../../../components/pages/contact.vue'
import testRoute from '../../../components/pages/test.vue'
import accountRoute from '../../../components/pages/account.vue'
import noticeRoute from '../../../components/pages/notice.vue'
import helpRoute from '../../../components/pages/help.vue'

import notFoundRoute from '../../../components/pages/not-found.vue'

export const routerOptions = {
  'mode':   'history',
  'routes': [
    {
      'path':      '/',
      'component': indexRoute,
      beforeEnter (to, from, next) {
        if (process.title === 'node') {
          Promise.all([
            store.dispatch('getLatestThemes', 6),
            store.dispatch('getPopularThemes', 6),
          ])
          .then(next)
          .catch(next)
        } else {
          Promise.all([
            store.dispatch('getLatestThemes', 6),
            store.dispatch('getPopularThemes', 6),
          ])
          .catch(raven.captureException)
          return next()
        }
      },
    },
    {
      'path':      '/help',
      'component': helpRoute,
    },
    {
      'path':      '/notice',
      'component': noticeRoute,
    },
    {
      'path':      '/login',
      'component': loginRoute,
    },
    {
      'path':      '/register',
      'component': registerRoute,
    },
    {
      'path':      '/account',
      'component': accountRoute,
    },
    {
      'path':      '/verify-email/:token',
      'component': verifyEmailRoute,
    },
    {
      'path':      '/search/:terms?',
      'component': searchRoute,
    },
    {
      'path':      '/contact',
      'component': contactRoute,
    },
    {
      'path':      '/profile/:id',
      'component': profileRoute,
      beforeEnter (to, from, next) {
        if (process.title === 'node') {
          getUser(to.params.id)
          .then(next)
          .catch(next)
        } else {
          getUser(to.params.id)
          .catch(raven.captureException)
          return next()
        }
      },
    },
    {
      'path':      '/theme/edit/:id?',
      'component': themeEditorRoute,
      beforeEnter (to, from, next) {
        if (!to.params.id) {
          return next()
        }

        if (process.title === 'node') {
          getTheme(to.params.id)
          .then(next)
          .catch(next)
        } else {
          getTheme(to.params.id)
          .catch(raven.captureException)
          return next()
        }
      },
    },
    {
      'path':      '/theme/:id/:options?',
      'component': themeRoute,
      beforeEnter (to, from, next) {
        if (process.title === 'node') {
          getTheme(to.params.id)
          .then(next)
          .catch(next)
        } else {
          getTheme(to.params.id)
          .catch(raven.captureException)
          return next()
        }
      },
    },
    {
      'path':      '/test',
      'component': testRoute,
    },
    {
      'path':      '*',
      'component': notFoundRoute,
    },
  ],
}
const router = new VueRouter(routerOptions)

router.beforeEach((to, from, next) => {
  if (
    process.browser
    && 'serviceWorker' in navigator
    && navigator.serviceWorker.controller
    && 'MessageChannel' in window
  ) {
    const {port2,} = new window.MessageChannel()

    navigator.serviceWorker.controller.postMessage({
      'action': 'cache-route',
      'route':  to.path,
    }, [
      port2,
    ])
  }

  next()
})

export default router
