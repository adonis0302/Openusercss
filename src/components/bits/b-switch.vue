<script>
  export default {
    'model': {
      'prop':  'model',
      'event': 'change',
    },
    'props': {
      'id':         String,
      'name':       String,
      'disabled':   Boolean,
      'required':   Boolean,
      'type':       String,
      'size':       String,
      'model':      [String, Number, Boolean, Array,],
      'inputClass': [String, Number, Array, Object,],
      'trueValue':  true,
      'falseValue': true,
      'value':      {
        'type':    [String, Number, Boolean,],
        'default': 'on',
      },
    },

    data () {
      const dt = this.getDateType()
      const t = this.getTrue()
      const f = this.getFalse()

      return {
        'checked': this.initCheck(this.model, t, dt),
        dt,
        t,
        f,
      }
    },

    'computed': {
      classObject () {
        const {type, size, checked,} = this

        return {
          [`is-${type}`]: type,
          [`is-${size}`]: size,
          checked,
        }
      },
    },

    'methods': {
      getDateType () {
        if (Array.isArray(this.model)) {
          return 2
        }

        if (this.model === 'boolean') {
          return 1
        }

        return 0
      },
      getTrue () {
        if (!this.trueValue) {
          return this.value
        }

        return this.trueValue
      },
      getFalse () {
        if (!this.falseValue) {
          return null
        }

        return this.falseValue
      },
      initCheck (model, value, dt) {
        if (dt === 2) {
          return model.includes(value)
        }

        if (dt === 1) {
          return model
        }

        return model === value
      },
      set (checked, model, t, f, dt) {
        if (dt === 2) {
          const i = model.indexOf(this.value)
          const has = i !== -1

          if (checked && !has) {
            model.push(t)
          } else if (!checked && has) {
            model.splice(i, 1)
          }
          this.$emit('change', model)
        } else if (dt === 1) {
          this.$emit('change', checked)
        } else if (checked) {
          this.$emit('change', t)
        } else {
          this.$emit('change', f)
        }
      },
      input () {
        this.set(this.checked, this.model, this.t, this.f, this.dt)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import 'node_modules/bulma/sass/utilities/initial-variables';
  @import '../../client/scss/autocolor';
  @import '../../client/scss/variables';
  @import 'node_modules/bulma/sass/utilities/derived-variables';

  .switch {
    --height: $size-normal;

    input {
      opacity: 0;
      display: inline-flex;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;
    }

    appearance: none;
    position: relative;
    outline: 0;
    border-radius: calc(0.8 * var(--height));
    width: calc(1.625 * var(--height));
    height: var(--height);
    background-color: $border;
    border: 1px solid $border;
    cursor: pointer;
    box-sizing: border-box;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;

    &:before,
    &:after {
      content: ' ';
      position: absolute;
      top: 0;
      left: 0;
      height: calc(var(--height) - 2px);
      border-radius: calc((var(--height) - 2px) / 2);
      transition: 0.233s;
    }
    &:before {
      width: calc(1.625 * var(--height) - 2px);
      background-color: $grey-lighter;
    }
    &:after {
      width: calc(var(--height) - 2px);
      background-color: #fff;
      box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1);
    }
    &.checked {
      border-color: nth($primary, 1);
      background-color: nth($primary, 1);

      &:before {
        transform: scale(0);
      }
      &:after {
        transform: translateX(calc(0.625 * var(--height)));
      }
    }

    @each $name, $pair in $colors {
      $color: nth($pair, 1);

      &.is-#{$name} {
        &.checked {
          border-color: $color;
          background-color: $color;
        }
      }
    }

    &.is-small {
      --height: $size-small;
    }
    &.is-medium {
      --height: $size-medium;
    }
    &.is-large {
      --height: $size-large;
    }
  }
</style>

<template lang="pug">
  label.switch(:class='classObject')
    input.checkbox(ref='input', type='checkbox', v-model='checked', @change='input', v-bind='{\
    id,\
    name,\
    value,\
    disabled,\
    required,\
    class: inputClass\
    }')
</template>
