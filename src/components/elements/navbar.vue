<script>
  import flushImg from './flush-img.vue'
  import icon from './icon.vue'

  export default {
    'components': {
      icon,
      flushImg,
    },
    'methods': {
      toggleOpen () {
        this.open = !this.open
      },
      close () {
        this.open = false
      },
    },
    data () {
      return {
        'open': false,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  $primary: map-get($colors, 'primary');
  $background: map-get($colors, 'background');

  .navbar {
    position: fixed;
    width: 100%;
    z-index: 100;
    height: map-get($kerning, 'navbar-height');

    .container,
    .navbar-brand,
    .navbar-burger {
      height: 100%;
    }
  }

  .body-spacer {
    height: map-get($kerning, 'navbar-height');
  }

  .navbar-brand {
    img {
      max-height: map-get($kerning, 'navbar-height');
      min-height: map-get($kerning, 'navbar-height');
    }
  }

  .navbar-menu {
    &.is-primary {
      background-color: map-get($tones, 'brand-primary');
    }
  }

  .spacer {
    width: 1rem;
  }

  .navbar-item:not(.no-active) {
    &.router-link-exact-active {
      background-color: nth($background, 1);
      color: nth($background, 2);
    }

    &:not(.router-link-exact-active):not(:hover) {
      background-color: nth($primary, 1);
      color: nth($primary, 2);
    }
  }
</style>

<template lang="pug">
  div.ouc-navbar-wrapper
    .navbar.ouc-navbar.is-primary.md-shadow--2
      .container
        .navbar-brand.ouc-navbar-brand
          router-link(to="/").navbar-item.no-active
            flush-img(source="/img/openusercss.icon-x64.png", placeholder="/img/openusercss.icon-x16.png", height="36px", width="36px")
            .spacer
            span OpenUserCSS
            .spacer
            .tag.is-secondary
              | Alpha!
          .navbar-burger(@click="toggleOpen")
            span
            span
            span
        .navbar-menu.is-primary.ouc-navbar-menu(:class="{'is-active': open}")
          .navbar-start
          .navbar-end(@click="close")
            router-link(v-if="session", :to="'/profile/' + currentUser._id").navbar-item
              icon(icon="account")
              | Welcome, {{currentUser.displayname}}
            a(v-if="session", @click.prevent="logout").navbar-item
              icon(icon="logout")
              | Log out
            router-link(to="/").navbar-item
              icon(icon="home")
              | Home
            router-link(v-if="!session", to="/login").navbar-item
              icon(icon="login")
              | Log in
            router-link(v-if="!session", to="/register").navbar-item
              icon(icon="account-plus")
              | Register
            router-link(to="/search").navbar-item
              icon(icon="magnify")
              | Search
            a(href="//forums.openusercss.org").navbar-item
              icon(icon="forum")
              | Forums
            router-link(to="/help").navbar-item
              icon(icon="help-circle")
              | Help

    .body-spacer
</template>
