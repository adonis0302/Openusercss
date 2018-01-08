<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import flushImg from './flush-img.vue'

  export default {
    'components': {
      'b-tag': bulma('tag', 'div'),
      flushImg,
    },
    'computed': {
      favicon () {
        return `//${this.host}/favicon.ico`
      },
    },
    'props': {
      'host': {
        'type':    String,
        'default': '',
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tag {
    padding: 14px;

    &:not(:last-child) {
      margin-bottom: 16px;
      margin-right: 16px;
    }

    > * {
      margin-right: 8px;
    }
  }
</style>

<template lang="pug">
  b-tag
    flush-img(height="16px", width="16px", :source="favicon", placeholder="/img/openusercss.icon-x16.png")
    slot(name="content")
</template>
