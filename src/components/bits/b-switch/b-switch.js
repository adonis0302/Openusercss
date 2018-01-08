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
