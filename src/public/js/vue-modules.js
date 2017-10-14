import VueRouter from 'vue-router'

import indexRoute from '../../../.tmp/routes/index/index.vue'
import browseRoute from '../../../.tmp/routes/browse/browse.vue'
import loginRoute from '../../../.tmp/routes/login/login.vue'
import registerRoute from '../../../.tmp/routes/register/register.vue'
import profileRoute from '../../../.tmp/routes/profile/profile.vue'
import newThemeRoute from '../../../.tmp/routes/new-theme/new-theme.vue'

export const router = new VueRouter({
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
      'path':      '/browse',
      'component': browseRoute
    },
    {
      'path':      '/profile',
      'component': profileRoute
    },
    {
      'path':      '/new-theme',
      'component': newThemeRoute
    }
  ]
})
