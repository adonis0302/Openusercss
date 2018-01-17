<script>
  import flushImg from './flush-img.vue'

  export default {
    'components': {
      flushImg,
    },
    'computed': {
      favicon () {
        return `//${this.host}/favicon.ico`
      },
    },
    'props': {
      'host': {
        'type':    String,
        'default': '',
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tag {
    padding: 14px;

    &:not(:last-child) {
      margin-bottom: 16px;
      margin-right: 16px;
    }

    > * {
      margin-right: 8px;
    }
  }
</style>

<template lang="pug">
  .tag.ouc-tag
    flush-img.ouc-tag-image(
      height="16px",
      width="16px",
      :source="favicon",
      placeholder="/img/openusercss.icon-x16.png"
    )
    slot(name="content")
</template>
