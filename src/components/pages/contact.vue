<script>
  import {decode,} from 'he'

  import oucFooter from '../elements/ouc-footer.vue'
  import navbar from '../elements/navbar.vue'

  export default {
    'components': {
      oucFooter,
      navbar,
    },
    mounted () {
      setTimeout(() => {
        this.showing = true
        this.email = decode(this.encodedEmail)
      }, 2500)
    },
    data () {
      return {
        'showing':      false,
        'email':        '(please wait...)',
        'encodedEmail': '&#x67;&#x72;&#x6F;&#x2E;&#x73;&#x73;&#x63;&#x72;&#x65;&#x73;&#x75;&#x6E;&#x65;&#x70;&#x6F;&#x40;&#x6D;&#x74;&#x6E;&#x65;&#x63;&#x65;&#x64;',
      }
    },
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .content
          h1 Contact
          hr
          p
            | There are various ways to contact me.
            br
            | The way you should do so depends
            | on what you want to message me about.
            br
            | Keep in mind, that I'm the developer&nbsp;
            b of this website.&nbsp;
            | If you want to contact the creator of a theme,
            | you can do so&nbsp;
            a(href="//forums.openusercss.org/", target="_blank") on the forums.
          ul
            li
              p
                | About CSS development, please post here:&nbsp;
                a(href="//forums.openusercss.org/category/5/theme-development", target="_blank")
                  | https://forums.openusercss.org/category/5/theme-development
            li
              p
                | About this site itself, or if you want to report themes, please post here:&nbsp;
                a(href="//forums.openusercss.org/category/6/openusercss-org", target="_blank")
                  | https://forums.openusercss.org/category/6/openusercss-org
            li
              p.is-inline
                | If you need to message me privately for other reasons, my email is&nbsp;
                p.is-inline.is-unselectable(:class="[{'has-text-reversed': showing}]") {{email}}

    ouc-footer
</template>
