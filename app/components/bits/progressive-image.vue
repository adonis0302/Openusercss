<script>
  export default {
    'props': [
      'height',
      'width',
      'src',
      'placeholder',
    ],
    data () {
      return {
        'style': {
          'height':            `${this.height}rem`,
          'width':             `${this.width}rem`,
          'background-image':  `url("${this.placeholder}")`,
          'background-repeat': 'no-repeat',
          'background-size':   'contain',
          'filter':            'blur(2px)',
        },
      }
    },
    mounted () {
      this.style['background-image'] = `url("${this.src}")`
      Reflect.deleteProperty(this.style, 'filter')
    },
  }
</script>

<template lang="pug">
  .ouc-responsive-image-wrapper
    .ouc-responsive-image(:style="style")
</template>
