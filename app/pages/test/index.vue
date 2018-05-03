<script>
  import spinner from '~/components/elements/spinner.vue'
  import oucLoading from '~/components/elements/loading.vue'

  export default {
    'transition': 'fade',
    'components': {
      spinner,
      oucLoading,
    },
    data () {
      return {
        'spinning': false,
      }
    },
    'methods': {
      showInfo () {
        this.$toast.info('This is an info message', 'Info')
      },
      showSuccess () {
        this.$toast.success('This is a success message', 'Success')
      },
      showWarning () {
        this.$toast.warning('This is a warning message', 'Warning')
      },
      showError () {
        this.$toast.error('This is an error message', 'Error', {
          'buttons': [
            [
              '<button class="button has-text-white">Toggle spinning</button>', () => {
                this.spinning = !this.spinning
              },
            ],
          ],
        })
      },
      causeError () {
        this.nonExist()
      },
      testLoading () {
        this.$refs.loading.start()
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
              button.button(@click="spinning = !spinning") Toggle spinning
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

          .column.is-2
            nuxt-link.button.is-danger(to="/test/error")
              | Test error page

          .column.is-2
            button.button.is-primary(@click="testLoading") Test loading
            ouc-loading(ref="loading", :test="true")
</template>
