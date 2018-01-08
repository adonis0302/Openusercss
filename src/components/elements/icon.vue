<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

  export default {
    'props': {
      'icon': {
        'type':    String,
        'default': 'exclamation',
      },
      'size': {
        'type':    String,
        'default': '18',
      },
      'color': {
        'type': String,
      },
    },
    'methods': {
      'classValue': (iconName, size) => {
        return `mdi-${iconName} mdi-${size}px`
      },
    },
    'components': {
      'b-icon': bulma('icon', 'span'),
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/mdi/scss/variables';
  $mdi-font-name: 'materialdesignicons-webfont';

  @import 'node_modules/mdi/scss/functions';
  @import 'node_modules/mdi/scss/core';
  @import 'node_modules/mdi/scss/icons';

  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/elements/icon';

  span {
    margin-right: .5rem;
  }

  i,
  b-icon {
    z-index: 2
  }

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  b-icon
    i.mdi(v-bind:class="classValue(icon, size)", :style="`color: ${color}`")
</template>
