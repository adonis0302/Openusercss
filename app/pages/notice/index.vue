<script>
  export default {
    'transition': 'fade',
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .content
          h1 Notice
          hr
          p
            | OpenUserCSS - A collection of custom website themes
            br
            | Copyright (C) 2017 Barnabás Bertényi
          p
            | This program is free software: you can redistribute it and/or modify
            | it under the terms of the GNU General Public License as published by
            | the Free Software Foundation, either version 3 of the License, or
            | (at your option) any later version.
          p
            | This program is distributed in the hope that it will be useful,
            | but WITHOUT ANY WARRANTY; without even the implied warranty of
            | MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
            | GNU General Public License for more details.
          p
            | You should have received a copy of the GNU General Public License
            | along with this program.  If not, see&nbsp;&lt;
            a.has-text-primary(
              href="https://www.gnu.org/licenses/",
              target="_blank",
              rel="nofollow noopener"
            )
              | https://www.gnu.org/licenses/
            | &gt;

          hr
          .level
            .is-brand-primary
              nuxt-link(to="/notice/licenses")
                .button.is-primary.is-backgroundless View Open Source licenses
              nuxt-link(to="/notice/applied-licenses")
                .button.is-primary.is-backgroundless About theme licenses
</template>
