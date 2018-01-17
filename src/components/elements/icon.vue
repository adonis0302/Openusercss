<script>
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
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/mdi/scss/variables';
  $mdi-font-name: 'materialdesignicons-webfont';

  @import 'node_modules/mdi/scss/functions';
  @import 'node_modules/mdi/scss/core';
  @import 'node_modules/mdi/scss/icons';

  span {
    margin-right: .5rem;
  }

  i,
  b-icon {
    z-index: 2
  }
</style>

<template lang="pug">
  .icon.ouc-icon
    i.mdi(v-bind:class="classValue(icon, size)", :style="`color: ${color}`")
</template>
