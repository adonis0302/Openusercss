<script>
  export default {
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
    slot(name="content")
</template>
