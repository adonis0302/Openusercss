<script>
  import {mapGetters,} from 'vuex'

  export default {
    'methods': {
      toggleOpen () {
        this.open = !this.open
      },
      close () {
        this.open = false
      },
    },
    'computed': mapGetters({
      'session': 'user/session',
    }),
    data () {
      return {
        'open': false,
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../scss/autocolor';
  @import '../../scss/variables';

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
    &.nuxt-link-exact-active {
      background-color: nth($background, 1);
      color: nth($background, 2);
    }

    &:not(.nuxt-link-exact-active):not(:hover) {
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
          nuxt-link(to="/").navbar-item.no-active
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
            nuxt-link(v-if="session", :to="'/profile/' + currentUser._id").navbar-item
              fa-icon(icon="account")
              | Welcome, {{currentUser.displayname}}
            a(v-if="session", @click.prevent="logout").navbar-item
              fa-icon(icon="sign-out")
              | Log out
            nuxt-link(to="/").navbar-item
              fa-icon(icon="home")
              | Home
            nuxt-link(v-if="!session", to="/login").navbar-item
              fa-icon(icon="sign-in-alt")
              | Log in
            nuxt-link(v-if="!session", to="/register").navbar-item
              fa-icon(icon="user-plus")
              | Register
            nuxt-link(to="/search").navbar-item
              fa-icon(icon="search")
              | Search
            a(href="//forums.openusercss.org").navbar-item
              fa-icon(icon="users")
              | Forums
            nuxt-link(to="/help").navbar-item
              fa-icon(icon="question-circle")
              | Help

    .body-spacer
</template>
