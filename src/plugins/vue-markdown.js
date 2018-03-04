import Vue from 'vue'
import VueMarkdown from 'vue-markdown'

Vue.component('vue-markdown', VueMarkdown)
Vue.mixin({
  'computed': {
    '$anchorAttributes': () => ({
      'target': '_blank',
      'rel':    'nofollow noopener',
    }),
  },
})
