<script>
  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'
  import icon from '../elements/icon.vue'
  import notification from '../elements/notification.vue'

  export default {
    'components': {
      oucFooter,
      navbar,
      icon,
      notification,
    },
    'computed': {
      extension () {
        return process.extension
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  .box {
    &.is-warning {
      background-color: nth($warning, 1);
      color: nth($warning, 2);
    }

    &.is-primary {
      background-color: nth($primary, 1);
      color: nth($primary, 2);
    }
  }
</style>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .content
          p
            | This page in under construction. What's here already works, but more
            | content is needed to cover topics. If you want to write some,&nbsp;
            a(href="https://github.com/OpenUserCSS/openusercss.org/issues/new", target="_blank")
              | open a new issue!

        .content
          h1 Installing themes

        hr
        .box.is-warning(v-if="!extension")
          p
            icon(icon="alert")
            a(href="https://add0n.com/stylus.html", target="_blank", rel="nofollow noopener")
              | You don't seem to have a compatible extension installed,
              | or an error occurred.
              | Click here to install Stylus to be able to use themes!
        div(v-if="extension")
          .box.is-primary
            p(v-if="extension.version")
              icon(icon="puzzle")
              | Detected extension: {{extension.name}}, version {{extension.version}}. You're good to go!
            p(v-if="!extension.version")
              icon(icon="puzzle")
              | Detected extension: {{extension.name}}. You're good to go!

          p Here's some info about what you can do with {{extension.name}}:
          .content
            ul
              li(v-if="extension.capabilities.includes('install-usercss')")
                | Since this extension can handle the usercss format, you can
                | click "Install with {{extension.name}}" on a theme page to
                | install it.
              li(v-if="extension.capabilities.includes('configure-after-install')")
                | Once a theme is installed, you'll be able to configure it in your extension.
              li(v-if="extension.capabilities.includes('configure-before-install')")
                | You'll be able to configure themes before installing them.
              li(v-if="extension.capabilities.includes('create-usercss') && extension.capabilities.includes('builtin-editor')")
                | You can create usercss compliant themes easily with this extension using its builtin code editor.
              li(v-if="extension.capabilities.includes('edit-usercss') && extension.capabilities.includes('builtin-editor')")
                | You can edit already installed themes with this extension using its builtin code editor.
              li(v-if="extension.capabilities.includes('import-moz-export')")
                | You can import themes that user the @moz- export format.
              li(v-if="extension.capabilities.includes('export-moz-export')")
                | You can export themes into the @moz- format.
              li(v-if="extension.capabilities.includes('update-manual')")
                | {{extension.name}} includes an update checker button that lets
                | you update installed themes easily.
              li(v-if="extension.capabilities.includes('update-auto')")
                | {{extension.name}} will check for updates for your themes
                | and apply them automatically when available.
              li(v-if="extension.capabilities.includes('export-json-backups')")
                | You can export your installed themes into a JSON formatted file
                | for safety.
              li(v-if="extension.capabilities.includes('import-json-backups')")
                | You can import your JSON backups into the extension to restore
                | what you backed up.
              li(v-if="extension.capabilities.includes('manage-local')")
                | You can view a list of installed themes in the extension and
                | disable, enable, edit or uninstall them.
              li(v-if="extension.capabilities.includes('search-remote')")
                | You can search for themes on websites without having to leave
                | the extension.
              li(v-if="extension.capabilities.includes('query-api')")
                | You can see a list of your installed themes straight
                | from OpenUserCSS without having to open the extension.
              li(v-if="extension.capabilities.includes('mutate-api')")
                | You can disable, enable or uninstall themes straight
                | from OpenUserCSS without having to open the extension.

          hr
          .content
            p
              | For further help, please drop us a line&nbsp;
              a(href="//forums.openusercss.org", target="_blank") on our community forums
              | , or visit&nbsp;
              router-link(to="/contact") the contact page

    ouc-footer
</template>
