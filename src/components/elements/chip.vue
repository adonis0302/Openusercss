<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import flushImg from '../flush-img/flush-img.vue'

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
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/elements/tag';

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

  @import '../../client/scss/reboot';
</style>

<template lang="pug">
  b-tag
    flush-img(height="16px", width="16px", :source="favicon", placeholder="/img/openusercss.icon-x16.png")
    slot(name="content")
</template>
