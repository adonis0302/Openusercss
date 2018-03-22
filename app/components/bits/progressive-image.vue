<script>
  export default {
    'props': {
      'height': [
        Number,
        String,
      ],
      'width': [
        Number,
        String,
      ],
      'src':         String,
      'placeholder': String,
      'size':        {
        'type':    String,
        'default': 'contain',
      },
    },
    data () {
      return {
        'commonStyle': {
          'height': `${this.height}`,
          'width':  `${this.width}`,
        },
        'style': {
          'height':            `${this.height}`,
          'width':             `${this.width}`,
          'background-image':  `url("${this.placeholder}")`,
          'background-repeat': 'no-repeat',
          'background-size':   this.size,
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
  .ouc-responsive-image-wrapper(:style="commonStyle")
    .ouc-responsive-image(:style="style")
</template>
