<script>
  export default {
    'transition': 'fade-zoom',
  }
</script>

<template lang="pug">
  div.ouc-route-root
    .container
      .section
        .content
          h1 This is not legal advice
          hr
          p
            | When you upload a theme to OpenUserCSS, you have a choice of applying
            | a license to it in order to permit more generous use of your theme.
            | For your convenience, this site provides a list of licenses written
            | by people that are not me, nor related to OpenUserCSS.
            | This list contains licenses that are popular in the Open Source
            | community and are approved by the&nbsp;
            a.has-text-primary(
              href="https://opensource.org",
              target="_blank",
              rel="noopener nofollow"
            ) Open Source Initiative.
            br
            | OSI is also not related to either me or OpenUserCSS.

          p
            | Of course, you always have the right to apply no license to your
            | theme. Keep in mind that by uploading your code to this site,
            | you're providing an implied license for the public to download and
            | use your theme for non-commercial purposes.
            br
            | You may also choose to apply a license not available in the list
            | of licenses. To do this, choose the "Other" option in the dropdown.
            | In this case, it falls on you to display your license text in
            | a prominent position in your theme description.

          p
            | I'm not a lawyer, nor does OpenUserCSS provide legal advice to anyone.
            | If you're concerned about copyright, please consult with your/an
            | attorney.
</template>
