import VueRouter from 'vue-router'

import store from './store'

import indexRoute from '../../../../.tmp/routes/index/index.vue'
import browseRoute from '../../../../.tmp/routes/browse/browse.vue'
import loginRoute from '../../../../.tmp/routes/login/login.vue'
import registerRoute from '../../../../.tmp/routes/register/register.vue'
import profileRoute from '../../../../.tmp/routes/profile/profile.vue'
import newThemeRoute from '../../../../.tmp/routes/new-theme/new-theme.vue'

import notFoundRoute from '../../../../.tmp/routes/not-found/not-found.vue'

const router = new VueRouter({
  'mode':   'history',
  'routes': [
    {
      'path':      '*',
      'component': notFoundRoute
    },
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
      'path':      '/browse',
      'component': browseRoute
    },
    {
      'path':      '/profile',
      'component': profileRoute
    },
    {
      'path':      '/theme/new',
      'component': newThemeRoute
    }
  ]
})

router.beforeEach((to, from, next) => {
  store.commit('actionError', null)
  next()
})

export default router
