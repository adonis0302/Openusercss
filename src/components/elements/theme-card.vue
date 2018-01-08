<script>
  import {bulmaComponentGenerator as bulma,} from 'vue-bulma-components'
  import icon from './icon.vue'
  import {LeftRight,} from '../../../src/shared/animations'

  export default {
    'components': {
      'b-card':              bulma('card', 'div'),
      'b-card-header':       bulma('card-header', 'div'),
      'b-card-header-title': bulma('card-header-title', 'div'),
      'b-card-header-icon':  bulma('card-header-icon', 'div'),
      'b-card-image':        bulma('card-image', 'div'),
      'b-card-content':      bulma('card-content', 'div'),
      'b-card-footer':       bulma('card-footer', 'div'),
      'b-card-footer-item':  bulma('card-footer-item', 'div'),
      'b-media':             bulma('media', 'div'),
      'b-media-left':        bulma('media-left', 'div'),
      'b-media-content':     bulma('media-content', 'div'),
      'b-tile':              bulma('tile', 'div'),
      'b-box':               bulma('box', 'div'),
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
      b-box(is-paddingless).ouc-theme-card
        b-tile(is-parent, is-paddingless)
          b-tile(is-child).ouc-theme-container
            slot(name="content").ouc-theme-slot
</template>
