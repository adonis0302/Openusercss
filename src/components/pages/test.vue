<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'

  import oucFooter from '../../components/ouc-footer/ouc-footer.vue'
  import spinner from '../../components/spinner/spinner.vue'
  import flushImg from '../../components/flush-img/flush-img.vue'

  export default {
    'components': {
      'b-container': bulma('container', 'div'),
      'b-columns':   bulma('columns', 'div'),
      'b-column':    bulma('column', 'div'),
      oucFooter,
      spinner,
      flushImg,
    },
    data () {
      return {
        'spinning': true,
      }
    },
    'methods': {
      showInfo () {
        this.$toast.info({
          'title':   'Info',
          'message': 'This is an info message',
          'timeout': false,
          'theme':   'ouc',
          'layout':  2,
        })
      },
      showSuccess () {
        this.$toast.success({
          'title':   'Success',
          'message': 'This is a success message',
          'timeout': false,
          'theme':   'ouc',
          'layout':  2,
        })
      },
      showWarning () {
        this.$toast.warning({
          'title':   'Warning',
          'message': 'This is a warning message',
          'timeout': false,
          'theme':   'ouc',
          'layout':  2,
        })
      },
      showError () {
        this.$toast.error({
          'title':   'Error',
          'message': 'This is an error message',
          'timeout': false,
          'theme':   'ouc',
          'layout':  2,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../../client/scss/autocolor';
  @import '../../../client/scss/variables';

  @import 'node_modules/bulma/sass/utilities/all';
  @import 'node_modules/bulma/sass/base/all';

  @import 'node_modules/bulma/sass/grid/columns';
  @import 'node_modules/bulma/sass/layout/section';
  @import 'node_modules/bulma/sass/elements/container';
  @import 'node_modules/bulma/sass/elements/button';

  @import '../../../client/scss/reboot';
</style>

<template lang="pug">
  div.route-root
    b-container
      .section
        b-columns(is-multiline)
          b-column(is-2)
            div
              p Spinner:
              spinner(:size="50", :spinning="spinning")
              div(style="background-color: black")
                spinner(:size="50", :spinning="spinning")

          b-column(is-2)
            p Notifications:
            button.button(@click="showInfo") Info
            button.button(@click="showSuccess") Success
            button.button(@click="showWarning") Warning
            button.button(@click="showError") Error

    ouc-footer
</template>
