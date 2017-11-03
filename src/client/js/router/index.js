import VueRouter from 'vue-router'

import indexRoute from '../../../../build/webserver/pages/index/index.vue'
import browseRoute from '../../../../build/webserver/pages/browse/browse.vue'
import loginRoute from '../../../../build/webserver/pages/login/login.vue'
import registerRoute from '../../../../build/webserver/pages/register/register.vue'
import profileRoute from '../../../../build/webserver/pages/profile/profile.vue'
import newThemeRoute from '../../../../build/webserver/pages/new-theme/new-theme.vue'

import notFoundRoute from '../../../../build/webserver/pages/not-found/not-found.vue'

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
