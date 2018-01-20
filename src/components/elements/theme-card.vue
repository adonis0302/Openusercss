<script>
  import icon from './icon.vue'
  import {LeftRight,} from '../../../src/shared/animations'

  export default {
    'components': {
      icon,
    },
    'methods': new LeftRight(),
    'props':   {
      'direction': {
        'type':    String,
        'default': 'vertical',
      },
      'height': {
        'type': String,
      },
      'card-class': {
        'type': String,
      },
      'tooltip': {
        'type':    String,
        'default': 'unknown',
      },
      'themeId': {
        'type':    String,
        'default': '',
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';

  $background: map-get($colors, 'background');

  .is-primary > .box {
    background-color: map-get($tones, 'brand-primary');
    color: text-for-bg(map-get($tones, 'brand-primary'));
  }

  .ouc-theme-favicon {
    background-color: white;
    border-radius: 50%;
    margin-top: -35px;
    float: right;
    margin-right: 10px;
    height: 25px;
    width: 25px;
    z-index: 2;
  }

  @import '../../client/scss/reboot';
</style>

<template lang="pug">
  transition(
    appear,
    @before-enter="beforeAppear",
    @enter="appear",
    :css="false"
  )
    router-link(:class="cardClass", :to="'/theme/' + themeId")
      .box.is-paddingless.ouc-theme-card
        .tile.is-parent.is-paddingless
          .tile.is-child.ouc-theme-container
            slot(name="content").ouc-theme-slot
</template>
