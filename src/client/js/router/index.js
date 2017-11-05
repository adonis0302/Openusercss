import VueRouter from 'vue-router'

import indexRoute from '../../../../.tmp/pages/index/index.vue'
import browseRoute from '../../../../.tmp/pages/browse/browse.vue'
import loginRoute from '../../../../.tmp/pages/login/login.vue'
import registerRoute from '../../../../.tmp/pages/register/register.vue'
import profileRoute from '../../../../.tmp/pages/profile/profile.vue'
import newThemeRoute from '../../../../.tmp/pages/new-theme/new-theme.vue'

import notFoundRoute from '../../../../.tmp/pages/not-found/not-found.vue'

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
      'path':      '/profile/:id',
      'component': profileRoute
    },
    {
      'path':      '/theme/new',
      'component': newThemeRoute
    }
  ]
})

export default router
