<script>
  import oucFooter from '../elements/ouc-footer.vue'
  import spinner from '../elements/spinner.vue'
  import flushImg from '../elements/flush-img.vue'

  export default {
    'components': {
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

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .columns.is-multiline
          .column.is-2
            div
              p Spinner:
              spinner(:size="50", :spinning="spinning")
              div(style="background-color: black")
                spinner(:size="50", :spinning="spinning")

          .column.is-2
            p Notifications:
            button.button(@click="showInfo") Info
            button.button(@click="showSuccess") Success
            button.button(@click="showWarning") Warning
            button.button(@click="showError") Error

    ouc-footer
</template>
