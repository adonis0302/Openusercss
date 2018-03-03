import VueRouter from 'vue-router'
import raven from 'raven-js'

import notFoundRoute from '../../../components/pages/not-found.vue'

const routerOptions = {
  /* 'mode':   'history',
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
    }, */
  'mode':   'history',
  'routes': [
    {
      'path':      '*',
      'component': notFoundRoute,
    },
  ],
}

export default new VueRouter(routerOptions)
