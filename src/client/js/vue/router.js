import VueRouter from 'vue-router'

import indexRoute from '../../../../build/components/routes/index/index.vue'
import browseRoute from '../../../../build/components/routes/browse/browse.vue'
import loginRoute from '../../../../build/components/routes/login/login.vue'
import registerRoute from '../../../../build/components/routes/register/register.vue'
import profileRoute from '../../../../build/components/routes/profile/profile.vue'
import newThemeRoute from '../../../../build/components/routes/new-theme/new-theme.vue'

import notFoundRoute from '../../../../build/components/routes/not-found/not-found.vue'

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
