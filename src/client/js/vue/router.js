import VueRouter from 'vue-router'

import indexRoute from '../../../../build/components/pages/index/index.vue'
import browseRoute from '../../../../build/components/pages/browse/browse.vue'
import loginRoute from '../../../../build/components/pages/login/login.vue'
import registerRoute from '../../../../build/components/pages/register/register.vue'
import profileRoute from '../../../../build/components/pages/profile/profile.vue'
import newThemeRoute from '../../../../build/components/pages/new-theme/new-theme.vue'

import notFoundRoute from '../../../../build/components/pages/not-found/not-found.vue'

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
