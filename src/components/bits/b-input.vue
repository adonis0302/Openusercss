<script>
  export default {
    'props': [
      'lazy',
      'value',
    ],
    mounted () {
      if (this.lazy) {
        this.$el.onchange = () => {
          this.$emit('input', this.$el.value)
        }
      } else {
        this.$el.oninput = () => {
          this.$emit('input', this.$el.value)
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/elements/form';

  @import '../../client/scss/reboot';
</style>

<template lang="pug">
  input(:value="value").input
</template>
